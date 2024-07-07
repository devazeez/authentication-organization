import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    user_id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    first_name: {
      type: 'varchar',
      notNull: true,
    },
    last_name: {
      type: 'varchar',
      notNull: true,
    },
    email: {
      type: 'varchar',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'varchar',
    },
    salt: {
      type: 'varchar',
    },
    phone: {
      type: 'varchar',
    },
    date_created: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    date_deleted: {
      type: 'timestamp with time zone',
    },
  });

  // Ensure the uuid-ossp extension is available for uuid_generate_v4()
  pgm.createExtension('uuid-ossp', { ifNotExists: true });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
}