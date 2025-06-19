const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
    try {
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        // 🔥 USERS
        await db.collection('users').doc('user_id_123').set({
            name: 'João Silva',
            email: 'joao@email.com',
            photoURL: '',
            createdAt: timestamp,
            updatedAt: timestamp,
            plan: 'free',
            stripeCustomerId: '',
            invitesCount: 0,
            invitedBy: '',
            points: 0,
            petsCount: 1,
            caresCount: 1,
            address: 'Rua dos Pets, 123',
            emergencyContacts: [
                { name: 'Dra. Carla Vet', phone: '+55 21 99999-9999' }
            ]
        });

        // 🔥 PETS
        await db.collection('pets').doc('pet_id_456').set({
            ownerId: 'user_id_123',
            name: 'Snow',
            species: 'cachorro',
            breed: 'Samoieda',
            birthDate: new Date('2020-05-10'),
            weight: 28,
            height: 60,
            size: 'grande',
            photoURL: '',
            notes: 'Alergia a frango',
            allergies: ['Frango', 'Poeira'],
            sharedWith: {
                'user_id_eleni': 'edit',
                'user_id_vet': 'view'
            },
            createdAt: timestamp,
            updatedAt: timestamp
        });

        // 🔥 CARES
        await db.collection('cares').doc('care_id_789').set({
            petId: 'pet_id_456',
            ownerId: 'user_id_123',
            type: 'medicamento',
            title: 'Colírio para olhos',
            description: 'Aplicar 2x ao dia',
            startDate: new Date('2025-06-18'),
            endDate: new Date('2025-07-01'),
            time: '08:00',
            repeat: 'diario',
            interval: '12h',
            reminderEnabled: true,
            lastApplied: new Date('2025-06-19T08:00:00Z'),
            createdAt: timestamp,
            updatedAt: timestamp
        });

        // 🔥 HISTORY
        await db.collection('history').doc('history_id_001').set({
            careId: 'care_id_789',
            petId: 'pet_id_456',
            ownerId: 'user_id_123',
            date: new Date('2025-06-19T08:00:00Z'),
            notes: 'Aplicado normalmente',
            createdAt: timestamp,
            updatedAt: timestamp
        });

        // 🔥 VET VISITS
        await db.collection('vetVisits').doc('visit_id_001').set({
            petId: 'pet_id_456',
            ownerId: 'user_id_123',
            clinic: 'Clínica Vet Amor',
            vetName: 'Dr. Ricardo',
            reason: 'Consulta de rotina',
            date: new Date('2025-06-15T10:00:00Z'),
            notes: 'Detectada alergia a pó.',
            diseaseId: 'disease_id_001',
            careId: 'care_id_789',
            createdAt: timestamp,
            updatedAt: timestamp
        });

        // 🔥 DISEASES
        await db.collection('diseases').doc('disease_id_001').set({
            petId: 'pet_id_456',
            ownerId: 'user_id_123',
            name: 'Alergia a pó',
            description: 'Reação severa à poeira',
            status: 'controlado',
            diagnosedAt: new Date('2025-06-15T10:00:00Z'),
            curedAt: '',
            createdAt: timestamp,
            updatedAt: timestamp
        });

        // 🔥 VACCINES CARD
        await db.collection('vaccinesCard').doc('vaccine_id_001').set({
            petId: 'pet_id_456',
            ownerId: 'user_id_123',
            vaccineName: 'V10',
            date: new Date('2025-05-10T00:00:00Z'),
            validUntil: new Date('2026-05-10T00:00:00Z'),
            vetName: 'Dra. Carla Vet',
            notes: 'Reação leve no local',
            documentURL: '',
            createdAt: timestamp,
            updatedAt: timestamp
        });

        // 🔥 EXAMS
        await db.collection('exams').doc('exam_id_001').set({
            petId: 'pet_id_456',
            ownerId: 'user_id_123',
            examType: 'ultrassom',
            date: new Date('2025-06-10T10:00:00Z'),
            status: 'realizado',
            resultDescription: 'Sem alterações detectadas',
            documentURL: '',
            notes: '',
            createdAt: timestamp,
            updatedAt: timestamp
        });

        // 🔥 HYGIENE SERVICES
        await db.collection('hygieneServices').doc('service_id_001').set({
            petId: 'pet_id_456',
            ownerId: 'user_id_123',
            serviceType: 'banho',
            date: new Date('2025-06-05T10:00:00Z'),
            location: 'PetShop Seu Cão Amigo',
            professionalName: 'Denis Michel',
            notes: 'Amei o banho com Denis. Ficou lindo!',
            createdAt: timestamp,
            updatedAt: timestamp
        });

        // 🔥 WEIGHT RECORDS
        await db.collection('weightRecords').doc('weight_id_001').set({
            petId: 'pet_id_456',
            ownerId: 'user_id_123',
            date: new Date('2025-06-01T00:00:00Z'),
            weight: 28,
            createdAt: timestamp,
            updatedAt: timestamp
        });

        // 🔥 CHECKLISTS
        await db.collection('checklists').doc('checklist_id_001').set({
            ownerId: 'user_id_123',
            title: 'Viagem para Petrópolis',
            petId: 'pet_id_456',
            items: [
                { item: 'Ração', checked: true },
                { item: 'Carteira de vacinação', checked: true },
                { item: 'Brinquedos', checked: false },
                { item: 'Coleira', checked: true }
            ],
            createdAt: timestamp,
            updatedAt: timestamp
        });

        // 🔥 PENDING INVITES
        await db.collection('pendingInvites').doc('invite_id_001').set({
            email: 'eleni@email.com',
            petId: 'pet_id_456',
            ownerId: 'user_id_123',
            permission: 'edit', // 'edit' ou 'view'
            status: 'pending',
            createdAt: timestamp,
            acceptedAt: null
        });

        console.log('✅ Banco Firestore populado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao popular o Firestore:', error);
    }
}

seed();
