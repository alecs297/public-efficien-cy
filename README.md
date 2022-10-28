# public-efficien-cy

A public clone of my `efficien-cy` repository, without the sensitive parts.
I will try to keep this up to date with the production version. The missing parts are the `utils/scrapper.js` snippets providing URLs to the actual calendar data.

## Find A Room

This project's aim is to find available rooms on CY Tech's Pau campus, from data gathered through celcat scrapping.

A public API is availablee for application integrations, together with it's redoc documentation.

## Self Hosting

The back-end is a Node.JS koa web server, the front-end is vanilla and uses Tailwindcss. The celcat provider code snippets are missing, you will need to create those yourself (you can use [this](https://github.com/alecs297/eisti-celcat) if you don't know how to extract the ICS files).

### Dependencies

You will need `node (17.X+)` and `npm`. To install the dependencies run

```
npm i
```

Once dependencies are installed, you can run the server with

```
npm run start
```

This will also run tailwind and redooc to build both css files and the API documentation.

## Contributions

Contributions and suggestions are welcome, however please don't make PRs to this repo. (this one is a clone)

If you want to contribute, report a bug or make a suggestion, open an issue. 