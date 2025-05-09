import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from "react-redux";
import store from './redux/store.js';
import App from "./App.jsx";
import { MetaTitleProvider } from './services/DynamicTitle.jsx';
import { decryptID } from './services/UrlEncode.js';
import { getMetaTitle,getCourses,getContents,getImages,getMenus,getCategories,getItems,getphotos } from './services/apiServices.js';
export async function render(url, user = null) {
    const helmetContext = {};
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const encryptedCourseId = urlParams.get('course');
    const encryptedCategoryId = urlParams.get('category');
    const decryptedCourseId = encryptedCourseId ? decryptID(encryptedCourseId) : null;
    const menuId = urlParams.get('menu');
    const itemId = urlParams.get('item');
    const page = url.split('?')[0];

    let metaTitle = "Default Title | My Website";
    const courses = await getCourses(user);
    const menus = decryptedCourseId ? await getMenus(encryptedCourseId) : [];
    const items= encryptedCategoryId ? await getItems(encryptedCategoryId) : [];
    const contents = menuId ? await getContents(menuId) : [];
    const images = menuId ? await getImages(menuId) : [];
    const categories=await getCategories(user);
    const photos=itemId? await getphotos(itemId) : [];

    // Fetch meta title based on the page and course ID
    metaTitle=await(getMetaTitle(page, decryptedCourseId))

    // Construct the initialData object
    const initialData = {
        courses,
        menus,
        contents,
        images,
        selectedCourse: encryptedCourseId,
        selectedMenu: menuId,
        user,
        categories,
        selectedCategory: encryptedCategoryId,
        items,
        selectedItem: itemId,
        photos
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