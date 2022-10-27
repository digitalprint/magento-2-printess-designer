
define(['Digitalprint_PrintessDesigner/js/penpal'], function() {

    let iframeInstance = null;
    let isChildConnected = false;

    let getIframeInstance = function(config) {

        if (null === iframeInstance) {

            const designPickerAttributes = config.attributes;

            const version = new Date().getTime();
            const iframe = document.createElement('iframe');

            const searchParams = new URLSearchParams();
            searchParams.append('designFormat', config.designFormat);

            if (! Array.isArray(designPickerAttributes)) {
                for (let attributeName in designPickerAttributes) {
                    let attribute = designPickerAttributes[attributeName];
                    searchParams.append(attributeName, JSON.stringify(attribute));
                }
            }

            searchParams.append('client', config.client);
            searchParams.append('locale', config.locale);
            searchParams.append('v', version.toString());

            iframe.src = config.path + '?' + searchParams.toString();
            iframe.classList.add('w-100', 'h-100');

            iframeInstance = iframe;

        }

        return iframeInstance

    }

    function postMessage(config) {

        const iframe = getIframeInstance(config);

        function renderLayouts(printess, layoutSnippets, forMobile, forLayoutDialog = false, insertTemplateAsLayoutSnippetCallback) {
            console.debug('window.uiHelper.customLayoutSnippetRenderCallback');

            if (isChildConnected === true) {
                console.debug('child is already connected, return iframe.');

                return iframe;
            }

            window.Penpal.connectToChild({
                iframe,
                debug: false,
                methods: {
                    designSelected(designId) {
                        insertTemplateAsLayoutSnippetCallback(designId, 'published', config.designFormat, 'layout');
                    },
                },
            });

            isChildConnected = true;

            return iframe;
        }

        window.uiHelper.customLayoutSnippetRenderCallback = renderLayouts;

    }

    return postMessage;
});
