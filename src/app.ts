import * as express from 'express'
import { Request, Response } from 'express'
import * as cors from 'cors'
import { createConnection } from 'typeorm'
import { User } from "./entitiy/user"
//importing amqlib 
import * as amqp from 'amqplib/callback_api'

createConnection().then(db => {

    //const studentRepository = db.getRepository(User);
    const authRepository = db.getRepository(User);

    amqp.connect('amqps://wmqmekbr:RCf9DHx6XLA0lpx7gk1T8OOT1x7Ax0eo@bonobo.rmq.cloudamqp.com/wmqmekbr', (error0, connection) => {
        if (error0) {
            throw error0
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1
            }

            const app = express()

            //for the frontend application
            app.use(cors({
                origin: ["http://localhost:3000"]
            }))

            app.use(express.json())


            app.post('/api/register', async (req: Request, res: Response) => {
                const { email, password } = req.body;
                const user = await authRepository.findOne({ email });
                if (!user) {
                    alert("User doesn't exists")
                   return res.json({ message: "User doesn't exists" });
                   //window.alert("Error")
                   //return 'http://localhost:8002/api/register';
                }
                else {
                    if (password !== user.password) {
                        alert("Password Incorrect")
                        return res.json({ message: "Password Incorrect" });
                        //window.alert("Password Incorrect")
                        
                    }

                    else {
                        return res.json({ message: "User exists" });
                    }
                }
            });

            app.post('/api/registernew', async (req: Request, res: Response) => {
                const { email, password, name } = req.body;
                const userExists = await authRepository.findOne({ email });
                if (userExists) {
                    return res.json({ message: "User already exists" });
                } else {
                    const newadmin = await authRepository.create(req.body);
                    const result = await authRepository.save(newadmin);

                    return res.send(result)
                }


                //channel.sendToQueue('student_added', Buffer.from(JSON.stringify(result)))



            });


            console.log('Listening to post 8002')
            app.listen(8002)
            //Closing the rabbitmq connection
            process.on('beforeExit', () => {
                console.log('closing')
                connection.close()
            })
        })

    })

})







