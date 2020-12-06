import React, { useState, useRef } from 'react';
import "./index.css";
import ImageProductShow from '../../../../../components/image-product-show';
import Upload_image_icon from '../../../../../images/svg/dashboard/upload_image.svg';
import Launch_icon from '../../../../../images/svg/dashboard/launch.svg';
import TextareaAutosize from 'react-textarea-autosize';
import { createIdProductFromName } from '../../../../../backup';
import axios from 'axios';

let fieldSchema = {
    id_product: "",
    name: "",
    tags: "",
    cost: {
        realCost: 0,
        discountPersent: 0,
        currentCost: 0
    },
    options: {
        colors: [],
        size: []
    },
    numberProductInStock: 75,
    images: {
        detail: [], // inital size
        preview: {
            mediumSize: [],  // 200x200 px
            smallSize: ""  // 100x100px
        }
    },
    information: {
        trademark: "",
        describe: "",
        dataSheet: [
            {
                name: "Upper",
                property: ""
            }, {
                name: "Sole",
                property: ""
            }, {
                name: "Style",
                property: ""
            }, {
                name: "Origin",
                property: ""
            }
        ]
    },
    rate: {
        star: -1,
        NumberPeopleRate: 0
    },
    reviews: []
}

export default function AdminCreateProductPage() {
    let [field, _] = useState(fieldSchema);

    let name = useRef();
    let tags = useRef();
    let realCost = useRef();
    let discountPersent = useRef();
    let colors = useRef();
    let numberProductInStock = useRef();
    let describe = useRef();
    let condition = useRef();
    let trademark = useRef();
    let star_rate = useRef();
    let people_rate = useRef();

    let dataSheet = {
        Upper: useRef(),
        Sole: useRef(),
        Style: useRef(),
        Origin: useRef()
    };


    let [size, setSize] = useState([]);
    let [imageFiles, setImageFiles] = useState([]);
    let [images, setImages] = useState([]);

    let [alert, setAlert] = useState("");

    function uploadImageHandler(e) {
        let files = e.target.files;

        for (let i=0; i < files.length; i++) {
            let file = files[i];
            let img_url = URL.createObjectURL(file);

            images.push(img_url);
            imageFiles.push(file);
        }

        setImages([...images]);
        setImageFiles([...imageFiles]);
    }

    function addSizeToSizeData(e) {
        let newSize = e.target.value;
        let checked = e.target.checked;
        
        if (checked) {
            size.push(newSize);
        } else {
            size = size.filter((item) => item !== newSize);
        }

        setSize([...size]);
    }


    async function assembleField() {
        let nameProduct = name.current.value;
        let tagNames = tags.current.value.split(';');
        let id_product = createIdProductFromName(nameProduct);

        console.log('id_product generate:', id_product);

        let images_field = {
            normalSize: [],
            smallSize:  []
        }
        for (let i = 1; i <= images.length; i++) {
            images_field.normalSize.push({
                id_image: `${id_product}-image--i-${i}`,
                url: ""
            });
            images_field.smallSize.push({
                id_image: `${id_product}-image--i-${i}`,
                url: ""
            });
        }

        field = {
            id_product: id_product,
            name: nameProduct,
            tags: tagNames,
            cost: {
                realCost: Number(realCost.current.value),
                discountPersent: Number(discountPersent.current.value)/100, // %
                currentCost: realCost.current.value*(1 - discountPersent.current.value/100)
            },
            options: {
                color: colors.current.value,
                sizes: size
            },
            numberProductInStock: Number(numberProductInStock.current.value),
            images: images_field,
            information: {
                trademark: trademark.current.value,
                describe: describe.current.value,
                dataSheet: [
                    {
                        name: "Upper",
                        property: dataSheet.Upper.current.value
                    }, {
                        name: "Sole",
                        property: dataSheet.Sole.current.value
                    }, {
                        name: "Style",
                        property: dataSheet.Style.current.value
                    }, {
                        name: "Origin",
                        property: dataSheet.Origin.current.value
                    }
                ]
            },
            rate: {
                star: Number(star_rate.current.value),
                NumberPeopleRate: Number(people_rate.current.value) 
            },
            reviews: []
        }

        let error = checkError(field);

        if (error !== "") {
            setAlert(error);
            return;
        } else {
            setAlert("")
        }
        

        console.log("Field of product: \n",field);

        await uploadProductToDatabase(field);
        await uploadImagesToDatabase(field.images.normalSize, imageFiles, id_product);
    }

    return(
        <div className="create-new-product-page main">

            <ImageProductShow width="390px">
                {
                    images.map((image, i) => {
                        return (
                            <div key={'image-show-prd-i-' + i}>
                                <img src={image} alt=""/>
                            </div>
                        );
                    })
                }
                {(images.length == 0) ? <Skeleton/> : (<div></div>)}
            </ImageProductShow>

            
            <div className="field">
                <div className="upload-image">
                    <h3>Upload Image -- </h3>
                    <div className="choose-file-upload">
                        <label htmlFor="choose-file-btn">
                            <img src={Upload_image_icon} alt=""/>
                            <h4>Choose Image</h4>

                            <input 
                                id="choose-file-btn"
                                type="file" 
                                onChange={uploadImageHandler}
                                style={{display: "none"}}
                                multiple
                            />
                        </label>
                    </div> 

                    <input type="text" className="name-product big-text" 
                        placeholder="Name Product"
                        ref={name}
                    />

                    <div className="rate-star form">
                        <h3 className="title">Rate --</h3>
                        <input type="text" className="star-rate medium-text" 
                            placeholder="Star-rate"
                            ref={star_rate}
                        />
                        <input type="text" className="number-people-rate medium-text" 
                            placeholder="Number people rate"
                            ref={people_rate}
                        />
                    </div>

                    <div className="form">
                        <h3 className="title">Describe</h3>
                        <TextareaAutosize 
                            placeholder="Type describe about this product..."
                            ref={describe}
                        />
                    </div>

                    <div className="form">
                        <h3 className="title">Cost</h3>
                        <input type="text" ref={realCost} 
                            placeholder="Real-cost" 
                        />
                        <input type="text" ref={discountPersent}
                            placeholder="Discount Persent (%)"
                        />
                    </div>

                    <div className="form">
                        <h3 className="title">Options</h3>
                        <input type="text" ref={colors} placeholder="colors"/>
                        <div className="input-checkboxs">
                            <h4>size:</h4>

                            <div className="check-box">
                                <input type="checkbox" id="sizeX" value="X" onChange={addSizeToSizeData} />
                                <label htmlFor="sizeX" >X</label>
                            </div>
                            <div className="check-box">
                                <input type="checkbox" id="sizeXL" value="XL" onChange={addSizeToSizeData}/>
                                <label htmlFor="sizeXL">XL</label>
                            </div>
                            <div className="check-box">
                                <input type="checkbox" id="sizeL" value="L" onChange={addSizeToSizeData}/>
                                <label htmlFor="sizeL">L</label>
                            </div>
                            <div className="check-box">
                                <input type="checkbox" id="sizeS" value="S" onChange={addSizeToSizeData}/>
                                <label htmlFor="sizeS">S</label>
                            </div>

                        </div>
                    </div>

                    <div className="form">
                        <h3 className="title">Availble In Stock</h3>
                        <input type="text" ref={numberProductInStock} placeholder="number products"/>
                    </div>

                    <title>Information</title>
                    <div className="information form">
                        <h3 className="title">Information</h3>
                        <input type="text" className="trademark" ref={trademark}
                            placeholder="Trademark"
                        />
                        <input type="text" className="condition" ref={condition} defaultValue="New Product"
                            placeholder="condition (default: New Product)"
                        />
                    </div>

                    <div className="form">
                        <h3 className="title">Tags</h3>
                        <input type="text" placeholder="tags name..." ref={tags}/>
                    </div>
                    
                </div>

            </div>
            
            <div className="down-area">
                <table className="table data-sheet" width="500px">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Property</th>
                        </tr>

                        <tr >
                            <td><input type="text" defaultValue="Upper"/></td>
                            <td><input type="text" placeholder="property" ref={dataSheet.Upper}/></td>
                        </tr>
                        <tr >
                            <td><input type="text" defaultValue="Sole"/></td>
                            <td><input type="text" placeholder="property" ref={dataSheet.Sole}/></td>
                        </tr>
                        <tr >
                            <td><input type="text" defaultValue="Style"/></td>
                            <td><input type="text" placeholder="property" ref={dataSheet.Style}/></td>
                        </tr>
                        <tr >
                            <td><input type="text" defaultValue="Origin"/></td>
                            <td><input type="text" placeholder="property" ref={dataSheet.Origin}/></td>
                        </tr>

                    </tbody>
                </table>

                {(alert.length > 0) && (<div className="alert">{alert}</div>)}

                <button className="launch-btn" onClick={assembleField}>
                    <img src={Launch_icon} alt="" className="icon"/>
                    <h3>Launch</h3>
                </button>
            </div>
        </div>
    );
}


function Skeleton() {
    let style = {
        width: "100%",
        height: "100%",
        background: "rgb(220, 220, 220)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "rgb(100, 100, 100)"
    }
    return (
        <div className="skeleton-box" style={style}>
            <h1>No image!</h1>
        </div>
    );
}

async function uploadProductToDatabase(field) {


    let result = {
        isSuccess: null,
        errors: []
    }

    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify(field);

    await axios.post('/api/products/post', body, config)
        .then((res) => {
            console.log(res.data);
            result.isSuccess = true;
        })
        .catch((err) => {
            let errors = err.response.data.errors;
            console.log(errors);
            result.isSuccess = false;
            result.errors = errors;
        })

    console.log(result);
    return result;
}

async function uploadImagesToDatabase(normalSizeImages, files, id_product) {
    for (let i=0; i < normalSizeImages.length; i++) {
        // body
        let formData = new FormData();
        formData.append('image', files[i]);
        formData.append('id_image', normalSizeImages[i].id_image);
        formData.append('id_product', id_product);

        // config
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        await axios.post('/api/images/upload', formData, config)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            })

    }
}

function checkError(field) {
    if (field.images.normalSize.length == 0) {
        return "Please pick images!";
    }

    if (field.name == "") {
        return "Please fill name product!"
    }

    return "";
}