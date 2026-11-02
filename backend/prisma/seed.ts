import { PrismaClient, Role, SpaceStatus, ReservationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing records
  await prisma.reservation.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const passwordHashAdmin = await bcrypt.hash('Admin123!', 10);
  const passwordHashUser = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador ReserveHub',
      email: 'admin@reservehub.com',
      password: passwordHashAdmin,
      role: Role.ADMIN,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'Jonathan García',
      email: 'jonathan@reservehub.com',
      password: passwordHashUser,
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Walter Herrera',
      email: 'walter@reservehub.com',
      password: passwordHashUser,
      role: Role.USER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Boris Garzona',
      email: 'boris@reservehub.com',
      password: passwordHashUser,
      role: Role.USER,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'Samuel Ruiz',
      email: 'samuel@reservehub.com',
      password: passwordHashUser,
      role: Role.USER,
    },
  });

  const user5 = await prisma.user.create({
    data: {
      name: 'Giancarlo Ortega',
      email: 'giancarlo@reservehub.com',
      password: passwordHashUser,
      role: Role.USER,
    },
  });

  const user6 = await prisma.user.create({
    data: {
      name: 'Mario López',
      email: 'mario@reservehub.com',
      password: passwordHashUser,
      role: Role.USER,
    },
  });

  console.log('✅ Users seeded: admin, jonathan, walter, boris, samuel, giancarlo, mario');

  // Create Spaces
  const spacesData = [
    {
      name: 'Sala de Reuniones A',
      description: 'Espacio ideal para reuniones ejecutivas, presentaciones y videoconferencias. Cuenta con pantalla 4K y climatización.',
      location: 'Edificio Central - Nivel 1, Oficina 102',
      capacity: 15,
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      status: SpaceStatus.ACTIVE,
    },
    {
      name: 'Sala de Conferencias B',
      description: 'Amplia sala equipada con proyector HD, sistema de sonido envolvente y mesas modulares para dinámicas de grupo.',
      location: 'Edificio Central - Nivel 2, Sala 204',
      capacity: 25,
      imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
      status: SpaceStatus.ACTIVE,
    },
    {
      name: 'Auditorio Magna C',
      description: 'Espacio de gran capacidad para conferencias masivas, simposios y eventos académicos con cabina de control y micrófono inalámbrico.',
      location: 'Edificio de Ingeniería - Nivel 3, Auditorio Principal',
      capacity: 60,
      imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
      status: SpaceStatus.ACTIVE,
    },
    {
      name: 'Laboratorio de Innovación 1',
      description: 'Equipado con 20 estaciones de trabajo de alto rendimiento, pizarras acrílicas y conectividad de fibra óptica dedicada.',
      location: 'Edificio Tecnológico - Nivel 1, Lab 101',
      capacity: 20,
      imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80',
      status: SpaceStatus.ACTIVE,
    },
    {
      name: 'Área de Coworking & Estudio',
      description: 'Ambiente dinámico y colaborativo con iluminación natural, tomas de corriente en cada mesa y área de descanso con café.',
      location: 'Biblioteca Universitaria - Planta Baja',
      capacity: 35,
      imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
      status: SpaceStatus.ACTIVE,
    },
  ];

  const createdSpaces = [];
  for (const s of spacesData) {
    const space = await prisma.space.create({ data: s });
    createdSpaces.push(space);

    // Create standard weekday schedules (Monday=1 through Friday=5: 07:00 to 20:00, Saturday=6: 08:00 to 14:00)
    for (let day = 1; day <= 5; day++) {
      await prisma.schedule.create({
        data: {
          spaceId: space.id,
          dayOfWeek: day,
          openingTime: '07:00',
          closingTime: '20:00',
          status: SpaceStatus.ACTIVE,
        },
      });
    }
    await prisma.schedule.create({
      data: {
        spaceId: space.id,
        dayOfWeek: 6,
        openingTime: '08:00',
        closingTime: '14:00',
        status: SpaceStatus.ACTIVE,
      },
    });
  }

  console.log(`✅ ${createdSpaces.length} Spaces and their schedules seeded.`);

  // Create Sample Reservations
  // For today and tomorrow
  const today = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  await prisma.reservation.create({
    data: {
      userId: user1.id,
      spaceId: createdSpaces[0].id,
      reservationDate: today,
      startTime: '09:00',
      endTime: '11:00',
      status: ReservationStatus.CONFIRMED,
      notes: 'Reunión de coordinación del equipo de desarrollo Web',
    },
  });

  await prisma.reservation.create({
    data: {
      userId: user2.id,
      spaceId: createdSpaces[1].id,
      reservationDate: today,
      startTime: '14:00',
      endTime: '16:00',
      status: ReservationStatus.CONFIRMED,
      notes: 'Taller de arquitectura de software y diseño de bases de datos',
    },
  });

  await prisma.reservation.create({
    data: {
      userId: user1.id,
      spaceId: createdSpaces[0].id,
      reservationDate: tomorrow,
      startTime: '10:00',
      endTime: '12:00',
      status: ReservationStatus.PENDING,
      notes: 'Revisión final de avance con el catedrático',
    },
  });

  console.log('✅ Sample reservations created.');
  console.log('🚀 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
