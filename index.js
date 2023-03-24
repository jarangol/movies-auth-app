import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from "firebase-admin/auth";
import express from 'express';
import bodyParser from 'body-parser';

initializeApp({
  credential: applicationDefault(),
});

const app = express()
const port = 3000
app.use(bodyParser.json());

app.post('/sign-up', async (req, res) => {
  try {
    const { email, password, name, phoneNumber } = req.body;

    const auth = getAuth();
    const userCredential = await auth.createUser({
      email,
      phoneNumber,
      password,
      displayName: name,
    })
    const user = userCredential;
    return res.send(user)
  } catch (error) {
    const errorMessage = error.message;
    return res.status(500).send({ errorMessage })
  }
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user;
    return res.send(user)
  } catch (error) {
    return res.status(500).send({ error: "Failed to login." })
  }
})

app.post('/logout', async (req, res) => {
  const auth = getAuth();
  signOut(auth).then((res) => res).catch((c) => {
    console.log(c)
    res.status(500)
  });
})

app.post('/token/verify', async (req, res) => {
  const { idToken } = req.body 
  try {
    getAuth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;
    console.log(uid)
    // ...
  })
  .catch((error) => {
    // Handle error
  });
  } catch (error) {
    console.log(error)
    return res.send({ error: "token is invalid"})
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})