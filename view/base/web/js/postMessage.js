
define(['penpal'], function() {

    let iframeInstances = [];
    let isChildConnected = false;

    let getIframeInstance = function(config, index) {

        if (!iframeInstances[index]) {

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

            iframeInstances[index] = iframe;

        }

        return iframeInstances[index];

    }

    function postMessage(config) {

        function renderLayouts(printess, layoutSnippets, forMobile, forLayoutDialog = false, insertTemplateAsLayoutSnippetCallback) {

            const index = JSON.stringify(forLayoutDialog);
            const iframe = getIframeInstance(config, index);

            if (isChildConnected === true) {
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
