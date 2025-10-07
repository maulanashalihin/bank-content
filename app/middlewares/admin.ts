import DB from "../services/DB";
import { Request, Response } from "../../type";

export default async (request: Request, response: Response) => {
    
    if (request.cookies.auth_id) {
        const session = await DB.from("sessions").where("id", request.cookies.auth_id).first();

        if (session) {
            const user = await DB.from("users").where("id", session.user_id).select(["id", "name", "email", "phone", "is_admin", "is_verified"]).first();
            
            if (user && user.is_admin) {
                request.user = user;
                request.share = {
                    "user": request.user,
                }
            } else {
                // User is not admin, redirect to home
                return response.redirect("/home");
            }
        } else {
            // Invalid session, redirect to login
            return response.cookie("auth_id", "", 0).redirect("/login");
        }
    } else {
        // No auth cookie, redirect to login
        return response.cookie("auth_id", "", 0).redirect("/login");
    }
}