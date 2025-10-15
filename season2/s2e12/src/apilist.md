# DevTinder api

authRouter

- POST /signup
- POST /login
- POST /logout

profileRouter

- GET /profile/view
- POST /profile/edit
- PATCH /profile/password

Status: interested,ignore, acceept, reject

connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter

- GET /user/connetions
- POST /user/requests
- GET /user/feed - ptofile of other users on the platform

//after match sending messsage
