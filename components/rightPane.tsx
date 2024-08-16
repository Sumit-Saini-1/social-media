import UserContext from "@/context/user/userContext";
import { Dropdown, MenuProps, Upload, UploadFile, UploadProps, Image, Modal } from "antd";
import { signOut } from "next-auth/react";
import Images from "next/image";
import { useContext, useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import ImgCrop from 'antd-img-crop';

export default function RightPane() {
    const user = useContext(UserContext);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [visible, setVisible] = useState(false);
    const onChange: UploadProps['onChange'] = async ({ fileList: newFileList, file }) => {
        setFileList(newFileList);
        user.setProfilePic(file?.response?.profilePic);
        // if (file.status == 'uploading') {
        //     console.log('Upload in progress:', file);
        // }
        // if (file.status == 'done') {
        //     const response = file.response;
        //     console.log('Upload successful:', response);
        //     if (response.success) {
        //         user.setProfilePic(response.profilePic);
        //     } else {
        //         console.error('Upload failed:', response.error);
        //     }
        // }
        // if (file.status === 'error') {
        //     console.error('Upload error:', file.error);
        // }
    };
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a onClick={() => setVisible(true)}>View Profile Pic</a>
            ),
        },
        {
            key: '2',
            label: (
                <label className="cursor-pointer">
                    Update Profile Pic
                    <ImgCrop rotationSlider>
                        <Upload
                            name="profilePic"
                            action="/api/upload/profilePic"
                            accept="image/*"
                            listType="picture-card"
                            showUploadList={false}
                            fileList={fileList}
                            onChange={onChange}
                            multiple={false}
                            maxCount={1}
                        >
                            {/* {fileList.length < 1 && '+ Upload'} */}
                        </Upload>
                    </ImgCrop>
                </label>
            ),
        },
    ]
    useEffect(() => {
        fetch("/api/user").then(res => {
            if (res.status == 200) {
                return res.json();
            }
        }).then(json => {
            // console.log(json);
            user.setProfilePic(json.profilePic);
            user.setUsername(json.username);
        })
    }, [user]);

    return (
        <>
            <div className="flex gap-2 items-center ml-8 cursor-pointer">
                <Dropdown menu={{ items }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Images src={user.profilePic || '/profile.png'} alt="profile" width={32} height={32} className="rounded-full" />
                    </a>
                </Dropdown>
                {user.username}
            </div>
            {
                user.username &&
                <div onClick={() => {
                    signOut();
                    user.Logout();
                }} className="flex gap-2 items-center ml-8 mt-4 cursor-pointer text-red-500">
                    <MdLogout className="text-2xl" /> Logout
                </div>
            }
            <Image
                alt="profilePic"
                width={200}
                style={{ display: 'none' }}
                src={user.profilePic || '/profile.png'}
                preview={{
                    visible,
                    src: user.profilePic || '/profile.png',
                    onVisibleChange: (value) => {
                        setVisible(value);
                    },
                    toolbarRender: () => {
                        return [];
                    },
                }}
            />
        </>
    );
}