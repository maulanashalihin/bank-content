"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
async function seed(knex) {
    await knex("users").update({
        is_admin: true
    });
}
;
//# sourceMappingURL=MakeAdmin.js.map