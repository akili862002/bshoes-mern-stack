import React, {useState} from 'react';
import './index.css';
import { Link } from 'react-router-dom';

import Facebook_icon from '../../images/svg/social_media/black-white/facebook.svg';
import Youtube_icon from '../../images/svg/social_media/black-white/youtube.svg';
import Twitter_icon from '../../images/svg/social_media/black-white/twitter.svg';
import Instagram_icon from '../../images/svg/social_media/black-white/instagram.svg';
import Github_icon from '../../images/svg/social_media/black-white/github.svg';
import Gmail_icon from '../../images/svg/social_media/black-white/gmail.svg';


export default function Footer() {
    let [contact_methods, _] = useState([
        {
            name: 'Facebook',
            icon_image: Facebook_icon,
            link: "https://www.facebook.com/rengar.the"
        },
        {
            name: 'Youtube',
            icon_image: Youtube_icon,
            link: "https://www.youtube.com/channel/UCF30K6CXzklIbqmZli8srmQ?view_as=subscriber"
        },
        {
            name: 'Twitter',
            icon_image: Twitter_icon,
            link: "#"
        },
        {
            name: 'Instagram',
            icon_image: Instagram_icon,
            link: "#"
        },
        {
            name: 'Github',
            icon_image: Github_icon,
            link: "https://github.com/akili862002"
        }
    ]);
    let [address, __] = useState({
        physic_address: "Trung Luong ward - Hong Linh Town - Ha Tinh province",
        comment: "We receive online order and delivery, do not support buying and receiving goods directly at the office or order processing center",
        gmailAddress: "dung862002@gmail.com"
    })

    return (
        <div className="footer">
            <div className="address-show card-info">
                <div className="title">Our office address</div>
                <div className="address-text">{address.physic_address}</div>
                <div className="comment">{address.comment}</div>
                <div className="gmail-address">
                    <img src={Gmail_icon} alt="" className="icon"/>
                    <p>{address.gmailAddress}</p>
                </div>
            </div>

            <div className="contact-me-show card-info" >
                <div className="title">Contact me</div>
                <div className="contact-methods">
                    {
                        contact_methods.map((item) => {
                            return (
                                <div className="item" key={"contact-me-k-" + item.name}>
                                    <a href={item.link}>
                                        <img src={item.icon_image} alt={item.name} className="icon"/>
                                    </a>
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <div className="note-from-dev">@ This website is created by Dung Nguyen</div>
        </div>
    )
}