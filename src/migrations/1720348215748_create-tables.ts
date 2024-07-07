import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Ensure the uuid-ossp extension is available for uuid_generate_v4()
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  // Create the users table
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

  // Create the organization table
  pgm.createTable('organization', {
    organization_id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    name: {
      type: 'varchar',
      notNull: true,
    },
    description: {
      type: 'varchar',
    },
    user_id: {
      type: 'uuid',
      references: '"users"(user_id)',
      onDelete: 'CASCADE',
    },
  });

  // Create the user_organizations table
  pgm.createTable('user_organizations', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    organization_id: {
      type: 'uuid',
      references: '"organization"(organization_id)',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'uuid',
      references: '"users"(user_id)',
      onDelete: 'CASCADE',
    },
    date_created: {
      type: 'timestamp with time zone',
      default: pgm.func('current_timestamp'),
    },
    date_deleted: {
      type: 'timestamp with time zone',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('user_organizations');
  pgm.dropTable('organization');
  pgm.dropTable('users');
}
