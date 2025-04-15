import { User } from "../index";
import { FastifyReply, FastifyRequest } from "fastify";
import db from "../../db";
import { server } from "../index";

export const login = async (request: FastifyRequest<{ Body: User }>,reply: FastifyReply) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply.status(400).send({ error: "Email and password are required" });
  }
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return reply.status(400).send({ error: "Invalid email format" });
  }

  db.get<{ password: string }>(
    "SELECT password FROM users WHERE email = ?",
    [email],
    async (err, row) => {
      if (err) {
        console.error("DB error:", err);
        return reply.status(500).send({ error: "Internal server error" });
      }

      if (!row) {
        return reply.status(401).send({ error: "Invalid email or password" });
      }
	console.log("Banquette arriere");
      try {

        const isMatch = await server.bcrypt.compare(password, row.password);
        if (isMatch) {
		  console.log("arriere");
          return reply.status(200).send({ success: true, message: "Login successful" });
        } else {

		  console.log("Crotte");
          return reply.status(401).send({ error: "Invalid email or password" });
        }
      } catch (err) {
        console.error("Bcrypt error:", err);
        return reply.status(500).send({ error: "Password comparison failed" });
      }
    }
  );
};
//if(!email || !password)
//	//  if yes go to 2 
//	// 2 decrypt password and compare with the one enter by user 
//	// if same log in 
//	// if not  send a reply 

