import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from "react-redux";
import store from './redux/store.js';
import App from "./App.jsx";
import { MetaTitleProvider } from './services/DynamicTitle.jsx';
import { decryptID } from './services/UrlEncode.js';

export async function render(url, user = null) {
    const helmetContext = {};
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const encryptedCourseId = urlParams.get('course');
    const decryptedCourseId = encryptedCourseId ? decryptID(encryptedCourseId) : null;
    const menuId = urlParams.get('menu');
    const page = url.split('?')[0];

    let metaTitle = "Default Title | My Website";
    let courses = [];
    let menus = [];
    let contents = [];
    let images = [];

    // Fetch meta title
    try {
        const metaRes = await fetch(
            decryptedCourseId
                ? `http://localhost:8081/api/meta-title?page=/course/${decryptedCourseId}`
                : `http://localhost:8081/api/meta-title?page=${page}`
        );
        if (metaRes.ok) {
            const metaData = (await metaRes.json()).data;
            metaTitle = metaData.metaTitle || metaTitle;
        }
    } catch (error) {
        console.error("Error fetching meta title:", error);
    }

    // Fetch courses
    if (user != null) {
        try {
            const coursesRes = await fetch(`http://localhost:8081/api/courses`);

            // console.log((await coursesRes.json()).data);
            if (coursesRes.ok) {
                // courses = (await coursesRes.json()).data;
                courses = (await coursesRes.json()).data;
                // courses=hlo.data.data
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    }
    // Fetch menus for the selected course
    if (decryptedCourseId) {
        try {
            const menusRes = await fetch(`http://localhost:8081/api/menu/${encryptedCourseId}`);
            if (menusRes.ok) {
                menus = (await menusRes.json()).data;
                // console.log("mennu",menus)
            }
        } catch (error) {
            console.error(`Error fetching menus for course ${decryptedCourseId}:`, error);
        }
    }

    // Fetch contents and images for the selected menu
    if (menuId) {
        try {
            const contentsRes = await fetch(`http://localhost:8081/api/content/${menuId}`);
            if (contentsRes.ok) {
                contents = (await contentsRes.json()).data;
                console.log(contents)
            }
        } catch (error) {
            console.error(`Error fetching contents for menu ${menuId}:`, error);
        }

        try {
            const imagesRes = await fetch(`http://localhost:8081/api/images/${menuId}`);
            if (imagesRes.ok) {
                images = await imagesRes.json();
            }
        } catch (error) {
            console.error(`Error fetching images for menu ${menuId}:`, error);
        }
    }

    // Construct the initialData object
    const initialData = {
        courses,
        menus,
        contents,
        images,
        selectedCourse: encryptedCourseId,
        selectedMenu: menuId,
        user,
    };

    // Render the app with initialData
    const appHtml = renderToString(
        <HelmetProvider context={helmetContext}>
            <StaticRouter location={url}>
                <Provider store={store}>
                    <MetaTitleProvider initialTitle={metaTitle}>
                        <App initialData={initialData} />
                    </MetaTitleProvider>
                </Provider>
            </StaticRouter>
        </HelmetProvider>
    );

    const { helmet } = helmetContext;

    return {
        appHtml,
        helmetData: {
            title: helmet?.title?.toString() || `<title>${metaTitle}</title>`,
        },
        initialData,
    };
}