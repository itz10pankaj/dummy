import fs from 'fs';
import path from 'path';
// import { fileURLToPath } from 
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
    const app = express();

    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
    });

    app.use(vite.middlewares);
    // app.use(express.static(path.resolve(__dirname, 'dist/client')));
    app.use(express.static(path.resolve(__dirname, 'client')));
    app.use(cookieParser());

    app.use('*', async (req, res, next) => {
        const url = req.originalUrl;

        try {
            let template = fs.readFileSync(
                path.resolve(__dirname, 'index.html'),
                'utf-8'
            );

            template = await vite.transformIndexHtml(url, template);

            const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');

            // Retrieve user data from cookies
            // const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
            let user = req.cookies.user ? JSON.parse(req.cookies.user) : null;;
            if (!user) user = null; 
            // Render the app with SSR
            const { appHtml, helmetData, initialData } = await render(url, user);

            // Inject the rendered HTML and initialData into the template
            const html = template
                .replace(`<!--ssr-outlet-->`, appHtml)
                .replace(
                    `<!--ssr-head-->`,
                    `
                    ${helmetData.title}
                    <script>
                    window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
                </script>
                `
                );

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });

    app.listen(5173, () => {
        console.log('Server is running at http://localhost:5173');
    });
}

createServer();