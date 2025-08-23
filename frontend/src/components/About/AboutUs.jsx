const AboutUs = () => {
    const teamMembers = [
        {
            name: "Sadik Rahman",
            role: "Frontend Developer",
            description:
                "Passionate about building intuitive user interfaces and improving user experience.",
            image: "https://scontent.fdac14-1.fna.fbcdn.net/v/t39.30808-6/487452451_4189529964610486_5665387257783119607_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEZPH11mVyBQoS5w8q00sl4hnD72sK9TDaGcPvawr1MNkhiUxueWHiMiHYaXoxcobZnvPDuQ2kBeWNsk_jo4oEq&_nc_ohc=Slu7dB0o40UQ7kNvwGPq8h9&_nc_oc=AdmQMwwjSWyh5BUZf1SX-0zXMFoN1ATflb3BvO8a2ha7unkGjar-Jm7BKsWIpaijMIQ&_nc_zt=23&_nc_ht=scontent.fdac14-1.fna&_nc_gid=PvOJDo8bkkm9Ci6E8e_huw&oh=00_AfW2xlZg7jPwkPBjxb72C8pTF3B1NxKjNcR1gR0u2odiEw&oe=68AF4C96",
        },
        {
            name: "Eusha Ahmed Mahi",
            role: "Backend Developer",
            description:
                "Specializes in server-side logic, databases, and API integrations.",
            image: "https://scontent.fdac14-1.fna.fbcdn.net/v/t1.6435-9/62245483_1326369990862492_8694947152272556032_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG2a7VuEznkQlN7dVCnuCmIHBqaO3nmfZgcGpo7eeZ9mLjMq33-cagsyolQ7ou5icmGQqKfcItydWXIh-AOO8fr&_nc_ohc=Um7b4H5IuJsQ7kNvwGk_LhZ&_nc_oc=AdmN60GfZUtvS6kmEFZ9_RihrmHuO8a0xXUDSw39XKTgZMPlsriK29Hvl2BuzzemLl4&_nc_zt=23&_nc_ht=scontent.fdac14-1.fna&_nc_gid=VFhbrsWPeb4v9l3lvnuUPg&oh=00_AfXS9dhy-oj7FTQR_M0WWAXQI_pBUiVA6iFIyt53BYkXJQ&oe=68D0E9AF",
        },
        {
            name: "Hasibur Rahman Srijon",
            role: "UI/UX Designer",
            description:
                "Focuses on creating visually appealing and user-friendly designs.",
            image: "https://scontent.fdac14-1.fna.fbcdn.net/v/t39.30808-6/495444755_4101387860120428_2313764023662061328_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHUiK_chH2ATjgYRlkw3vVcKnnfvWQMYNMqed-9ZAxg0w7wClr47zPK-8byjWiFe_Nvbw_4cmonGLbGnvfldWa3&_nc_ohc=jrE9KY-PzMQQ7kNvwHB26xF&_nc_oc=AdlM7xQ6PgjMCdqisJK_RtlL8jIjtKUyne6B9__El8jfSaytZDV9wtYhJxthADf6_gI&_nc_zt=23&_nc_ht=scontent.fdac14-1.fna&_nc_gid=EHW1Sh2ELGnz-7ETkYafVA&oh=00_AfU1b47aumufPMhAY7eUAc6gYC6-EIeuxb_RZ8k7cgt93A&oe=68AF4B26",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
                    About Us
                </h1>
                <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Our Mission
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        At Eventify, our mission is to simplify event management
                        for university clubs and students. We aim to provide a
                        seamless platform where students can discover and
                        register for events, and club admins can effortlessly
                        organize and manage their activities.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        We believe in fostering a vibrant campus community by
                        connecting students with exciting opportunities.
                    </p>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Meet Our Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-lg overflow-hidden"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-blue-600 font-medium mb-2">
                                    {member.role}
                                </p>
                                <p className="text-gray-600">
                                    {member.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
