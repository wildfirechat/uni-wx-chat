import resizeImage from "resize-image";

function mergeImages(sources = [], options = {}) {
    // Defaults
    let defaultOptions = {
        format: 'image/png',
        quality: 0.92,
        width: undefined,
        height: undefined,
        Canvas: undefined
    };
    return new Promise(resolve => {
        options = Object.assign({}, defaultOptions, options);

        sources = sources.filter(source => source !== null && source !== undefined);

        // Setup browser/Node.js specific variables
        const canvas = options.Canvas ? new options.Canvas() : window.document.createElement('canvas');
        const Image = options.Canvas ? options.Canvas.Image : window.Image;
        if (options.Canvas) {
            options.quality *= 100;
        }

        let targetSize = 64;
        let divider = 1;
        var size = 0;

        switch (sources.length) {
            case 2:
                size = (targetSize - 3 * divider) / 2;
                break;
            case 3:
                size = (targetSize - 3 * divider) / 2;
                break;
            case 4:
                size = (targetSize - 3 * divider) / 2;
                break;
            case 5:
                size = (targetSize - 4 * divider) / 3;
                break;
            case 6:
                size = (targetSize - 4 * divider) / 3;
                break;
            case 7:
                size = (targetSize - 4 * divider) / 3;
                break;
            case 8:
                size = (targetSize - 4 * divider) / 3;
                break;
            case 9:
                size = (targetSize - 4 * divider) / 3;
                break;
            default:
                break;
        }

        sources = sources.slice(0, sources.length >= 9 ? 9 : sources.length);

        // Load sources
        const images = sources.map(source => new Promise((resolve, reject) => {
            // Convert sources to objects
            if (source.constructor.name !== 'Object') {
                source = {src: source};
            }

            // Resolve source and img when loaded
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            //img.onerror = () => reject(new Error('Couldn\'t load image'));
            img.onerror = () => resolve(null);
            img.onload = () => resolve(Object.assign({}, source, {data: resizeImage.resize(img, size, size, resizeImage.PNG)}));
            img.src = source.src;
        }));

        const loadResizedImages = (resizedImagesBase64) => resizedImagesBase64.map(image => new Promise((resolve, reject) => {
            // Resolve source and img when loaded
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            //img.onerror = () => reject(new Error('Couldn\'t load image2'));
            img.onerror = () => resolve(null);
            img.onload = () => resolve(Object.assign({}, {img}));
            img.src = image.data;
        }));

        // Get canvas context
        const ctx = canvas.getContext('2d');

        // When sources have loaded
        resolve(Promise.all(images)
            .then((images) => {
                images = images.filter(i => i !== null);
                return Promise.all(loadResizedImages(images));
            })
            .then(images => {

                images = images.filter(i => i !== null);

                // Set canvas dimensions
                // const getSize = dim => options[dim] || Math.max(...images.map(image => image.img[dim]));
                // canvas.width = getSize('width');
                // canvas.height = getSize('height');
                canvas.width = targetSize;
                canvas.height = targetSize;
                switch (images.length) {
                    case 2:
                        images[0].x = divider;
                        images[0].y = targetSize / 4;
                        images[1].x = images[0].x + size + divider;
                        images[1].y = images[0].y;
                        break;
                    case 3:
                        images[0].x = targetSize / 4;
                        images[0].y = divider;

                        images[1].x = divider;
                        images[1].y = images[0].y + size + divider;
                        images[2].x = images[1].x + size + divider;
                        images[2].y = images[1].y;
                        break;
                    case 4:
                        images[0].x = divider;
                        images[0].y = divider;
                        images[1].x = images[0].x + size + divider;
                        images[1].y = divider;

                        images[2].x = divider;
                        images[2].y = images[0].y + size + divider;
                        images[3].x = images[2].x + size + divider;
                        images[3].y = images[2].y;
                        break;
                    case 5:
                        images[0].x = (targetSize - 2 * size - divider) / 2;
                        images[0].y = (targetSize - 2 * size - divider) / 2;
                        images[1].x = images[0].x + size + divider;
                        images[1].y = images[0].y;

                        images[2].x = divider;
                        images[2].y = images[1].y + size + divider;
                        images[3].x = images[2].x + size + divider;
                        images[3].y = images[2].y;
                        images[4].x = images[3].x + size + divider;
                        images[4].y = images[2].y;
                        break;
                    case 6:
                        images[0].x = divider;
                        images[0].y = (targetSize - 2 * size - divider) / 2;
                        images[1].x = images[0].x + size + divider;
                        images[1].y = images[0].y;
                        images[2].x = images[1].x + size + divider;
                        images[2].y = images[0].y;

                        images[3].x = divider;
                        images[3].y = images[0].y + size + divider;
                        images[4].x = images[3].x + size + divider;
                        images[4].y = images[3].y;
                        images[5].x = images[4].x + size + divider;
                        images[5].y = images[3].y;
                        break;
                    case 7:
                        images[0].x = divider + size + divider;
                        images[0].y = divider;

                        images[1].x = divider;
                        images[1].y = images[0].y + size + divider;
                        images[2].x = images[1].x + size + divider;
                        images[2].y = images[1].y;
                        images[3].x = images[2].x + size + divider;
                        images[3].y = images[1].y;

                        images[4].x = divider;
                        images[4].y = images[1].y + size + divider;
                        images[5].x = images[4].x + size + divider;
                        images[5].y = images[4].y;
                        images[6].x = images[5].x + size + divider;
                        images[6].y = images[4].y;
                        break;
                    case 8:
                        images[0].x = (targetSize - 2 * size - divider) / 2;
                        images[0].y = divider;
                        images[1].x = images[0].x + size + divider;
                        images[1].y = images[0].y;

                        images[2].x = divider;
                        images[2].y = images[0].y + size + divider;
                        images[3].x = images[2].x + size + divider;
                        images[3].y = images[2].y
                        images[4].x = images[3].x + size + divider;
                        images[4].y = images[2].y;

                        images[5].x = divider;
                        images[5].y = images[2].y + size + divider;
                        images[6].x = images[5].x + size + divider;
                        images[6].y = images[5].y;
                        images[7].x = images[6].x + size + divider;
                        images[7].y = images[5].y;
                        break;
                    case 9:
                        images[0].x = divider;
                        images[0].y = divider;
                        images[1].x = images[0].x + size + divider;
                        images[1].y = images[0].y;
                        images[2].x = images[1].x + size + divider;
                        images[2].y = images[0].y;

                        images[3].x = divider;
                        images[3].y = images[0].y + size + divider;
                        images[4].x = images[3].x + size + divider;
                        images[4].y = images[3].y;
                        images[5].x = images[4].x + size + divider;
                        images[5].y = images[3].y;

                        images[6].x = divider;
                        images[6].y = images[3].y + size + divider;
                        images[7].x = images[6].x + size + divider;
                        images[7].y = images[6].y;
                        images[8].x = images[7].x + size + divider;
                        images[8].y = images[6].y;
                        break;
                }

                ctx.fillStyle = '#CCCCCC';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Draw images to canvas
                images.forEach(image => {
                    ctx.globalAlpha = image.opacity ? image.opacity : 1;
                    return ctx.drawImage(image.img, image.x || 0, image.y || 0);
                });

                if (options.Canvas && options.format === 'image/jpeg') {
                    // Resolve data URI for node-canvas jpeg async
                    return new Promise(resolve => {
                        canvas.toDataURL(options.format, {
                            quality: options.quality,
                            progressive: false
                        }, (err, jpeg) => {
                            if (err) {
                                throw err;
                            }
                            resolve(jpeg);
                        });
                    });
                }

                // Resolve all other data URIs sync
                return canvas.toDataURL(options.format, options.quality);
            }));
    })
}


async function genGroupPortrait(groupMemberUsers) {
    let groupMemberPortraits = [];
    for (let i = 0; i < Math.min(9, groupMemberUsers.length); i++) {
        groupMemberPortraits.push(groupMemberUsers[i].portrait)
    }
    return await mergeImages(groupMemberPortraits);
}

// return {data uri, orgWidth, orgHeight}
function imageThumbnail(filePath) {
    return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: filePath,
                success: (res) => {
                    //---------利用canvas压缩图片--------------
                    let ratio = 2;
                    let imageWidth = res.width;
                    let imageHeight = res.height;
                    let canvasWidth = res.width //图片原始长宽
                    let canvasHeight = res.height
                    while (canvasWidth > 200 || canvasHeight > 200) {// 保证宽高在200以内
                        canvasWidth = Math.trunc(res.width / ratio)
                        canvasHeight = Math.trunc(res.height / ratio)
                        ratio++;
                    }
                    console.log('getImageinfo', filePath, res)

                    wx.createSelectorQuery()
                        .select('#myCanvas') // 在 WXML 中填入的 id
                        .fields({node: true, size: true})
                        .exec(qres => {
                            const canvas = qres[0].node
                            canvas.width = canvasWidth;
                            canvas.height = canvasHeight;

                            const ctx = canvas.getContext('2d')

                            const image = canvas.createImage()
                            image.onload = () => {
                                ctx.drawImage(
                                    image,
                                    0,
                                    0,
                                    canvasWidth,
                                    canvasHeight,
                                )
                                //留一定的时间绘制canvas
                                setTimeout(() => {
                                    wx.canvasToTempFilePath({
                                        canvas: canvas,
                                        width: canvasWidth,
                                        height: canvasHeight,
                                        fileType: 'jpg',
                                        quality: 0.5,
                                        success: (res) => {
                                            let tempFilePath = res.tempFilePath;
                                            const fs = wx.getFileSystemManager()
                                            // 读取文件， base64 格式
                                            let base64Str = fs.readFileSync(tempFilePath, 'base64')
                                            resolve(base64Str, imageWidth, imageHeight)
                                            console.log('image thumbnail size', base64Str.length, imageWidth, imageHeight, canvasWidth, canvasHeight)

                                        },
                                        fail: (res) => {
                                            console.log('canvasToTempFilePath error', res.errMsg)
                                            resolve()
                                        }
                                    })
                                }, 100)
                            }
                            image.src = res.path;
                        })
                },
                fail: (res) => {
                    console.log('getImageInfo error', res.errMsg)
                    resolve()
                }
            })
        }
    )
}

function _loadVideo(file) {
    let video = document.getElementById('bgvid');
    if (file.path) {
        if (file.path.startsWith('/')) {
            video.src = 'local-resource://' + (file.path.indexOf(file.name) > -1 ? file.path : file.path + file.name); // local video url
        } else {
            video.src = file.path;
        }
    } else {
        let reader = new FileReader();
        reader.onload = function (event) {
            video.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function videoDuration(file) {
    return new Promise(
        (resolve, reject) => {
            let video = document.getElementById('bgvid');
            video.onplay = () => {
                resolve(video.duration);
            };
            video.onerror = () => {
                resolve(0);
            };
            _loadVideo(file)
            console.log('----------', video);
        });
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

function fileFromDataUri(dataUri, fileName) {
    const blob = dataURItoBlob(dataUri);
    const resultFile = new File([blob], fileName);
    return resultFile;
}

function scaleDown(width, height, maxWidth, maxHeight) {
    if (width < maxWidth && height < maxHeight) {
        return {width, height}
    }

    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;

    // 计算比例最小的缩放倍数
    const scale = Math.min(widthRatio, heightRatio);

    // 缩放后的宽度和高度
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    return {width: Math.ceil(scaledWidth), height: Math.ceil(scaledHeight)};
}

export {mergeImages, genGroupPortrait, videoDuration, imageThumbnail, fileFromDataUri, scaleDown};
