import React, { useState, useEffect } from 'react'
import { auth, googleProvider } from '../Firebase/Firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '../Firebase/Firebase';
import { getDocs, collection, query, addDoc, orderBy, serverTimestamp, memoryLocalCache } from 'firebase/firestore';



const imageURL = `https://plus.unsplash.com/premium_photo-1728217446958-197eb1e4037b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;


export default function Main() {

    //for div 1
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const [displaymail, setDisplayMail] = useState("Not Logged In");    //mail
    const [profileImg, setprofileImg] = useState(imageURL);
    const [isLoggedin, setLogimStatus] = useState(false)                //login


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setDisplayMail(user.email);
                setprofileImg(user.photoURL)
                setLogimStatus(true)
            } else {
                setDisplayMail('Not Logged In');
                setprofileImg(imageURL)
                setLogimStatus(false)
            }
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
    }, []);


    const SignIn = async () => {
        if (!Email || !Password) {
            console.error("Email and password requried"); //email or password cannt be empty
            return;
        }


        try {
            await createUserWithEmailAndPassword(auth, Email, Password) //if valid then


            //after signIn

        } catch (err) {
            console.error(err)
        }

        // console.log(auth?.currentUser?.email);
        // setDisplayMail((auth?.currentUser ? auth.currentUser.email : "No user signed in"))
    }



    const signInWithGoogle = async () => {

        try {
            await signInWithPopup(auth, googleProvider)

        } catch (err) {
            console.error(err);
        }


        // console.log(auth?.currentUser?.email);
        // console.log(auth?.currentUser?.photoURL);
    }


    const LogOut = async () => {
        try {
            await signOut(auth)
        } catch (err) {
            console.error(err);
        }
    }


    //!--------------------------------------------------------------------
    // ! for fiv 2
    const [allpost, setallpost] = useState([]);

    //* not useed image
    // const dp_link = `https://images.unsplash.com/photo-1640951613773-54706e06851d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D`;

    // const [dp, setDp] = useState(dp_link);
    // const [userEmail, setUserEmail] = useState("");
    const [likecount, setLikecount] = useState(0);
    const [text, setText] = useState("");



    //! Post section
    const postCollectionRef = collection(db, "posts")

    // const getData = async () => {
    //     try {
    //         //read the data
    //         //set the movie list
    //         const data = await getDocs(postCollectionRef)

    //         const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    //         console.log(filteredData);
    //         setallpost(filteredData); //save data

    //     } catch (err) {
    //         console.error(err)
    //     }

    // }

    const getData = async () => {
        try {
            const q = query(postCollectionRef, orderBy("timestamp", "desc")); // Order by timestamp
            const data = await getDocs(q);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            console.log(filteredData);
            setallpost(filteredData); // Save data
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {

        getData() //call function
    }, [])
    // console.log(auth?.currentUser ? auth.currentUser.email : "No user signed in");



    function getUsernameFromEmail(Email) {
        if (typeof Email !== "string") return null;
        const atIndex = Email.indexOf("@");
        return atIndex !== -1 ? Email.substring(0, atIndex) : 'anonymous';
    }



    const onSubmitPost = async () => {
        try {

            // setLikecount(Number(setLikecount(likecount)) + 1)
            await addDoc(postCollectionRef, {
                dp: profileImg,
                email: displaymail,
                text: text,
                like: likecount,
                username: `@${getUsernameFromEmail(displaymail)}`,
                timestamp: serverTimestamp(), // Add timestamp
            })

            console.log("posted")
            setText(""); // Clear input after post
            getData(); // Refresh posts

            getData();/////////////////
        } catch (err) {
            console.err(err)
        }
    }


    //*---------------------------------------------------------------------------------
    //! return part

    return (
        <div className='Main'>

            {/* login and logout saection */}
            <div className="div div-1">

                {/*  login  */}
                <div className="login" style={{ display: isLoggedin ? "none" : "grid" }}>

                    <h2>Login</h2>

                    <input
                        type="email"
                        name="email"
                        placeholder='Enter Your Email'
                        onChange={(e) => SetEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder='Enter Your password'
                        onChange={(e) => SetPassword(e.target.value)}
                    />

                    <button onClick={SignIn}>Login</button>
                    <button onClick={signInWithGoogle}>Login with Google</button>
                </div>

                {/* {logout} */}
                <div className="logout" style={{ display: !isLoggedin ? "none" : "grid" }}>
                    <div className="top-div">
                        <h2>Logout</h2>
                        <img src={profileImg} alt="not found" />

                    </div>

                    <button onClick={LogOut}>Logout</button>
                </div>

            </div>











            {/* Main post section */}
            <div className="div div-2">

                {/* home bar */}
                <div className="upload-post">

                    <h2>Create Post</h2>
                    <div className='upload-post-flex'>
                        <textarea
                            placeholder='Create a post . . .'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>


                        <button onClick={onSubmitPost}>
                            Post
                        </button>

                    </div>

                </div>


                {/* Post container */}
                <div className="post-container">

                    {allpost.map((post) => {

                        return (
                            //!post
                            <div className='post' key={post.id}>

                                <div className="post-top">
                                    <img src={post.dp} alt="" />
                                    <h3>{post.username}</h3>
                                </div>
                                <div className="post-body">
                                    <p>{post.text}</p>
                                </div>
                                <div className="post-bottom">
                                    <button disabled>{post.like}</button>
                                    <button disabled>Copy</button>
                                </div>

                            </div>
                        )
                    })}

                </div>
            </div>



            {/* notice */}
            <div className="div div-3">

                <ul style={{marginLeft: '1.5rem'}}>
                    <li style={{ color: 'red' }}>Email login recomanded</li>
                    <li>reaction and copy option disabled!</li>
                    <li>Website is not responsive</li>
                    <li>if u dont login- your post will be 'anonymous'</li>
                    <br />
                    <li>If u login with google,only Your <b style={{ color: 'red' }}>email address, profile picture will be stored</b></li>
                    <li>Everyone can see your post without login</li>
                    <br /><br />
                    <li><h3>U could not delete post</h3></li>
                </ul>
            </div>
        </div>
    )
}
