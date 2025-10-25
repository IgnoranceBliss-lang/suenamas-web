// functions/src/index.ts
// OK, equipo, volvemos a Functions v2. Blaze plan es necesario de todos modos.
import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";

admin.initializeApp();
const db = admin.firestore();

// ==================================================================
// --- FUNCIÓN 1: INVITAR PACIENTE (Sintaxis v2) ---
// ==================================================================

export const invitePatient = onCall(async (request) => {
  // 1. Verificación de Seguridad
  if (request.auth?.token.role !== "clinician") {
    throw new HttpsError(
      "permission-denied",
      "Solo los clínicos pueden invitar pacientes."
    );
  }

  const patientEmail: string = request.data.email;
  const clinicianId: string = request.auth.uid;

  if (!patientEmail) {
    throw new HttpsError(
      "invalid-argument",
      "El email es requerido."
    );
  }

  try {
    // 2. Encontrar al Paciente
    const patientUserRecord = await admin.auth().getUserByEmail(patientEmail);
    const patientId = patientUserRecord.uid;

    // 3. Conectar las Cuentas
    const clinicianRef = db.collection("users").doc(clinicianId);
    const patientRef = db.collection("users").doc(patientId);

    await db.runTransaction(async (transaction) => {
      transaction.update(clinicianRef, {
        patientUIDs: admin.firestore.FieldValue.arrayUnion(patientId),
      });
      transaction.update(patientRef, {
        clinicianId: clinicianId,
      });
    });

    return { success: true, message: "Paciente conectado exitosamente." };
  } catch (error) {
    console.error("Error al invitar paciente:", error);
    throw new HttpsError(
      "not-found",
      "No se encontró un paciente con ese correo."
    );
  }
});

// ==================================================================
// --- FUNCIÓN 2: GENERAR ALERTAS (Sintaxis v2 + Lógica v2) ---
// ==================================================================
// Usamos onSchedule y renombramos 'event' a '_event'
export const generateAlerts = onSchedule("every 24 hours", async (_event) => {
  
  console.log("--- Empezando el cron job 'generateAlerts' (v2) ---");

  // 1. Obtenemos TODOS los pacientes.
  const patientsSnapshot = await db
    .collection("users")
    .where("role", "==", "patient")
    .get();

  // 2. Iterar sobre cada paciente
  for (const patientDoc of patientsSnapshot.docs) {
    const patient = patientDoc.data();
    
    // 3. Obtener los últimos 3 registros de sueño
    const logsSnapshot = await db
      .collection("sleepLogs")
      .where("patientId", "==", patientDoc.id)
      .orderBy("logDate", "desc")
      .limit(3)
      .get();

    if (logsSnapshot.docs.length < 3) {
      continue;
    }

    const logs = logsSnapshot.docs.map((doc) => doc.data());

    // 4. Lógica de Negocio
    const allLowQuality = logs.every((log) => log.sleepQuality < 2);

    // 5. Crear la Alerta (Lógica v2)
    if (allLowQuality) {
      if (patient.clinicianId) {
        await db.collection("alerts").add({
          clinicianId: patient.clinicianId, 
          patientId: patientDoc.id,
          patientEmail: patient.email,
          alertType: "Baja calidad de sueño persistente",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isViewed: false,
        });
        console.log(`ALERTA (para Clínico) generada para paciente ${patientDoc.id}`);
      } else {
        await db.collection("alerts").add({
          clinicianId: null,
          patientId: patientDoc.id,
          patientEmail: patient.email,
          alertType: "Baja calidad de sueño persistente",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isViewed: false,
        });
        console.log(`ALERTA (para Paciente) generada para paciente ${patientDoc.id}`);
      }
    }
  }
  
  console.log("--- Cron job 'generateAlerts' (v2) terminado ---");
  return; // En v2, onSchedule espera 'void' o 'Promise<void>'
});