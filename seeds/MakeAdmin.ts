import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
  
    // Inserts seed entries
    await knex("users").update({
        is_admin: true
    });
};
