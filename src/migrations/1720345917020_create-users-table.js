"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shorthands = void 0;
exports.up = up;
exports.down = down;
exports.shorthands = undefined;
function up(pgm) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
function down(pgm) {
    return __awaiter(this, void 0, void 0, function* () {
        pgm.dropTable('users');
    });
}
