import { define } from "../utils.ts";

export default define.page(function App({ Component }) {
  return (
    <html class="dark">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>WorkflowS</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossorigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <style>
          {`.material-symbols-outlined {
             font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
           }`}
        </style>
      </head>
      <body class="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
        <Component />
      </body>
    </html>
  );
});
