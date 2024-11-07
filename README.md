[![Netlify Status](https://api.netlify.com/api/v1/badges/49d9155a-494f-47f8-b6d5-d538815168ef/deploy-status)](https://app.netlify.com/sites/flippingames/deploys)

## Project setup

Recommended node 16.

### Frontend

```
cd client
npm install
cp .env.template .env.development
npm run start
```

The app will open on port 3000.

### Backend

```
cd socketio-server
npm install
```

Create `.env` file in ./sokcetio-server containing:

```
NODE_ENV="development"
```

Start app with `npm run dev`

## Deployment

### Frontend

Deployment is handled by Netlify. It will get triggered every time there is new change in master.
Env variable needs to point to server instance running on fly.io - this is set so only need to worry about it if we move away from fly.io.

### Backend

Requires installed & started docker.

```
# Install flyctl with curl
$ curl https://fly.io/install.sh | sh

# Install flyctl with powershell
$ pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Login to Fly
$ flyctl auth login
> Email: flippingames0@gmail.com
> Password: **************

# Deploy the app, from the socketio-server directory in powershell IDE terminal window 
# Use GC RT account. This step will take a few minutes
$flyctl --app flippin-game deploy .

```

## Tech Stack

- react + redux + typescript
- socket.io + typescript
- webdriver.io

## Links

- [fly.io dashboard](https://fly.io/apps/flippin-game)
- [netlify dashboard]()(https://app.netlify.com/sites/flippingames/overview)
- [github](https://github.com/Flippin-Games/flippin-games)
- [github user](https://github.com/flippingames)
- [socket.io](https://socket.io/)
