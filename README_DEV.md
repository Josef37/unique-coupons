I'm glad you've come this far and consider contributing. And if you're my future there, appreciate I was thinking about you with this documentation :smile:

## Developing

There are no special requirements for developing. There are just some for nice admin panel development:

-   You have to install node.js and run **`npm run build:admin`** to update the admin app.
-   You can also run **`npm run start:admin`** to start in development mode. Every change will recompile the admin app.
    -   When you want to load these assets for the wordpress admin area, replace the `LiveAssetLoader` with **`DevAssetLoader`** in `src/Loader.php`.
    -   When you want to use the self-refreshing app on `http://localhost:3000`, you have to provide a valid **nonce** in `src/Admin/view/public/index.html` (just go to your admin dashboard an enter `wpApiSettings.nonce` in the console).
    -   You also have to copy the "logged_in" **cookie** from your local wordpress site to `http://localhost:3000`.

## Testing

The tests are also run in CI. So you don't have to necessarily run them locally.

To run tests locally, you have to install PHPUnit (up to version 7.x) and make the command available inside your plugin directory.
Set up the test environment by running `npm run test:setup`, which will work out of the box if you used [VVV](https://varyingvagrantvagrants.org/) for your local site (have look at the [test documentation](https://make.wordpress.org/cli/handbook/misc/plugin-unit-tests/) for other setups). This will setup a test database `unique_coupons_test`.
Now just run `npm run test` to run all tests.

## Publishing

`npm run zip` will create a zip-package of the plugin. It will run all necessary build steps. You can find the output in the `plugins` directory.
