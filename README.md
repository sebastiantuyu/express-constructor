# Express constructor
With `express-constructor` you can build faster any kind of API. You only need to specify the routes an that's it, we help you to generate the built in code that you need.


### Installation
```
npm i express-constructor
```

# How to use?

1. Create a `routes.json` file specifying all your routes needed, like in the following example:
```json
  {
    "appName": {
      "root": "/",
      "routes": [
        {
          "method": "path"
        }
      ]
    }
  }
```



2. Run the following command from the root folder.
```
constructor --port=customOptionalPort
```


3. Start coding!


## Routes samples
Imagine you need an api where you'll be handling users session, and also, product prices. You may need something like this:
```json
  {
    "users": {
      "root": "users/",
      "routes": [
        {
          "post": "login/"
        },
        {
          "post": "logout/"
        }
      ]
    },
    "products": {
      "root": "products/",
      "routes": [
        {
          "get": "get_all/"
        },
        {
          "post": "update/:productId"
        }
      ]
    }
  }
```

With that, express-constructor will build something like:

```
yourFolder
│   package.json
│   index.js
│   .gitignore
└───src
  │ │
  │ └───products
  │     │  index.js
  │     │  routes.js
  │
  └─────users
        │  index.js
        │  routes.js


```

