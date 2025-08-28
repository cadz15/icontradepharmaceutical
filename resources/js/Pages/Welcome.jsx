import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

const Welcome = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Smooth scrolling for anchor links
        const handleAnchorClick = (e) => {
            const href = e.target.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    setIsMobileMenuOpen(false);

                    // Scroll to target
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                    });
                }
            }
        };

        // Add event listeners to all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach((anchor) => {
            anchor.addEventListener("click", handleAnchorClick);
        });

        // Animation on scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll(
                ".mission-vision-card, .product-card, .stats-item"
            );

            elements.forEach((element) => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;

                if (elementPosition < screenPosition) {
                    element.style.opacity = "1";
                    element.style.transform = "translateY(0)";
                }
            });
        };

        // Set initial state for animated elements
        const animatedElements = document.querySelectorAll(
            ".mission-vision-card, .product-card, .stats-item"
        );
        animatedElements.forEach((element) => {
            element.style.opacity = "0";
            element.style.transition = "all 0.5s ease";
        });

        // Trigger first check
        animateOnScroll();

        // Add scroll event listener
        window.addEventListener("scroll", animateOnScroll);

        // Cleanup
        return () => {
            anchorLinks.forEach((anchor) => {
                anchor.removeEventListener("click", handleAnchorClick);
            });
            window.removeEventListener("scroll", animateOnScroll);
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <Head title="I.con Trade Pharmaceutical" />
            <div className="font-sans">
                {/* Navigation */}
                <nav className="bg-white shadow-lg sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20 items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="flex items-center">
                                    <i className="fas fa-pills text-blue-600 text-3xl mr-2"></i>
                                    <span className="text-xl font-bold text-blue-800">
                                        I.con Trade Pharmaceutical
                                    </span>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-center space-x-4">
                                    <a
                                        href="#home"
                                        className="text-blue-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Home
                                    </a>
                                    <a
                                        href="#about"
                                        className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        About
                                    </a>
                                    <a
                                        href="#products"
                                        className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Products
                                    </a>
                                    <a
                                        href="#mission"
                                        className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Mission & Vision
                                    </a>
                                    <a
                                        href="#contact"
                                        className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Contact
                                    </a>
                                </div>
                            </div>
                            <div className="md:hidden">
                                <button
                                    onClick={toggleMobileMenu}
                                    className="text-gray-600 hover:text-blue-600 focus:outline-none"
                                >
                                    <i className="fas fa-bars text-2xl"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    <div
                        className={`md:hidden ${
                            isMobileMenuOpen ? "block" : "hidden"
                        }`}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
                            <a
                                href="#home"
                                className="text-blue-800 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                Home
                            </a>
                            <a
                                href="#about"
                                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                About
                            </a>
                            <a
                                href="#products"
                                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                Products
                            </a>
                            <a
                                href="#mission"
                                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                Mission & Vision
                            </a>
                            <a
                                href="#contact"
                                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                Contact
                            </a>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section id="home" className="hero-bg text-white py-32 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Better Healthcare for Filipinos
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Providing high-quality, affordable pharmaceutical
                            products across Visayas, Southern Luzon, and
                            Northern Mindanao
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="#products"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                            >
                                Our Products
                            </a>
                            <a
                                href="#contact"
                                className="bg-transparent hover:bg-white hover:text-blue-800 text-white font-bold py-3 px-6 border-2 border-white rounded-lg transition duration-300"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-blue-800 mb-4">
                                About I.con Trade Pharmaceutical
                            </h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2">
                                <img
                                    src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                    alt="Pharmaceutical Laboratory"
                                    className="rounded-lg shadow-xl w-full h-auto"
                                />
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                                    Committed to Filipino Health
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    I.con Trade Pharmaceutical is a leading
                                    pharmaceutical company dedicated to
                                    improving healthcare accessibility for
                                    Filipinos. With our state-of-the-art
                                    facilities and rigorous quality control, we
                                    produce medicines that meet international
                                    standards while remaining affordable for
                                    all.
                                </p>
                                <p className="text-gray-600 mb-6">
                                    Our team of dedicated researchers,
                                    pharmacists, and healthcare professionals
                                    work tirelessly to develop innovative
                                    solutions tailored to the needs of our
                                    communities.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                        <span className="text-gray-700">
                                            GMP Certified
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                        <span className="text-gray-700">
                                            FDA Approved
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                        <span className="text-gray-700">
                                            Quality Assured
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-blue-800 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="stats-item p-6">
                                <div className="text-4xl font-bold mb-2">
                                    15+
                                </div>
                                <div className="text-lg">
                                    Years in Operation
                                </div>
                            </div>
                            <div className="stats-item p-6">
                                <div className="text-4xl font-bold mb-2">
                                    200+
                                </div>
                                <div className="text-lg">Products</div>
                            </div>
                            <div className="stats-item p-6">
                                <div className="text-4xl font-bold mb-2">
                                    500+
                                </div>
                                <div className="text-lg">
                                    Partner Pharmacies
                                </div>
                            </div>
                            <div className="stats-item p-6">
                                <div className="text-4xl font-bold mb-2">
                                    3M+
                                </div>
                                <div className="text-lg">Patients Served</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                <section id="products" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-blue-800 mb-4">
                                Our Products
                            </h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                We offer a wide range of pharmaceutical products
                                to meet various healthcare needs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Product 1 */}
                            <div className="product-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                <div className="h-48 bg-blue-100 flex items-center justify-center">
                                    <i className="fas fa-capsules text-blue-600 text-6xl"></i>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Cardiovascular Medicines
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        High-quality medications for heart
                                        health and blood pressure management.
                                    </p>
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        Learn More{" "}
                                        <i className="fas fa-arrow-right ml-1"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Product 2 */}
                            <div className="product-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                <div className="h-48 bg-green-100 flex items-center justify-center">
                                    <i className="fas fa-prescription-bottle-alt text-green-600 text-6xl"></i>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Antibiotics
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Effective antibiotic formulations to
                                        combat bacterial infections.
                                    </p>
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        Learn More{" "}
                                        <i className="fas fa-arrow-right ml-1"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Product 3 */}
                            <div className="product-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                <div className="h-48 bg-purple-100 flex items-center justify-center">
                                    <i className="fas fa-tablets text-purple-600 text-6xl"></i>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Pain Relievers
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Safe and effective pain management
                                        solutions for various conditions.
                                    </p>
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        Learn More{" "}
                                        <i className="fas fa-arrow-right ml-1"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Product 4 */}
                            <div className="product-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                <div className="h-48 bg-yellow-100 flex items-center justify-center">
                                    <i className="fas fa-syringe text-yellow-600 text-6xl"></i>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Vaccines
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Essential vaccines for disease
                                        prevention and public health.
                                    </p>
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        Learn More{" "}
                                        <i className="fas fa-arrow-right ml-1"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Product 5 */}
                            <div className="product-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                <div className="h-48 bg-red-100 flex items-center justify-center">
                                    <i className="fas fa-allergies text-red-600 text-6xl"></i>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Antihistamines
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Reliable allergy relief medications for
                                        various allergic conditions.
                                    </p>
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        Learn More{" "}
                                        <i className="fas fa-arrow-right ml-1"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Product 6 */}
                            <div className="product-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                <div className="h-48 bg-teal-100 flex items-center justify-center">
                                    <i className="fas fa-heartbeat text-teal-600 text-6xl"></i>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Vitamins & Supplements
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Essential nutrients to support overall
                                        health and wellness.
                                    </p>
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        Learn More{" "}
                                        <i className="fas fa-arrow-right ml-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center">
                                View All Products{" "}
                                <i className="fas fa-chevron-right ml-2"></i>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section id="mission" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-blue-800 mb-4">
                                Our Mission & Vision
                            </h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Mission Card */}
                            <div className="mission-vision-card bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
                                <div className="flex items-center mb-6">
                                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                                        <i className="fas fa-bullseye text-blue-600 text-xl"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Our Mission
                                    </h3>
                                </div>
                                <p className="text-gray-600">
                                    To ensure the health of the Filipino people
                                    by providing better quality and affordable
                                    health care products. To constantly strive
                                    to meet or exceed our customer needs and
                                    expectations of price and services. To this
                                    end, we will perform periodic reviews of the
                                    marketplace to improve our offerings. To
                                    stay ahead of competition by innovating new
                                    products and services based on the needs of
                                    our customers and market demand.
                                </p>
                            </div>

                            {/* Vision Card */}
                            <div className="mission-vision-card bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
                                <div className="flex items-center mb-6">
                                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                                        <i className="fas fa-eye text-blue-600 text-xl"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        Our Vision
                                    </h3>
                                </div>
                                <p className="text-gray-600">
                                    To be the leading local Pharmaceutical
                                    Company in the whole Visayas, Southern Luzon
                                    and Northern Mindanao. We aspire to be
                                    recognized as the most trusted provider of
                                    high-quality, affordable medicines that
                                    improve the health and well-being of
                                    communities we serve.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 bg-blue-800 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">
                                What Our Partners Say
                            </h2>
                            <div className="w-20 h-1 bg-white mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Testimonial 1 */}
                            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <i className="fas fa-user-md text-blue-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">
                                            Dr. Maria Santos
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Cardiologist, Cebu City
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">
                                    "I.con Trade Pharmaceutical's cardiovascular
                                    medications have been reliable in my
                                    practice. Their quality is comparable to
                                    international brands but at a fraction of
                                    the cost, making them accessible to more of
                                    my patients."
                                </p>
                                <div className="mt-4 text-yellow-400">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                            </div>

                            {/* Testimonial 2 */}
                            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <i className="fas fa-user-nurse text-blue-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">
                                            Nurse Juan Dela Cruz
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Hospital Pharmacist, Iloilo
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">
                                    "We've been using PrimeCare products in our
                                    hospital for 5 years now. Their consistent
                                    quality and reliable supply chain make them
                                    our preferred local pharmaceutical partner."
                                </p>
                                <div className="mt-4 text-yellow-400">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star-half-alt"></i>
                                </div>
                            </div>

                            {/* Testimonial 3 */}
                            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <i className="fas fa-store text-blue-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Luis Tan</h4>
                                        <p className="text-sm text-gray-600">
                                            Pharmacy Owner, Davao
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">
                                    "Our customers trust PrimeCare products
                                    because they deliver results. The company's
                                    excellent customer service and fair pricing
                                    help our business thrive while serving our
                                    community."
                                </p>
                                <div className="mt-4 text-yellow-400">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-blue-800 mb-4">
                                Contact Us
                            </h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                Get in touch with our team for inquiries,
                                partnerships, or product information
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-12">
                            <div className="md:w-1/2">
                                <form className="space-y-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Subject"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="5"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Your Message"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>

                            <div className="md:w-1/2">
                                <div className="bg-gray-50 p-8 rounded-lg shadow-sm h-full">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                                        Our Contact Information
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="flex items-start">
                                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                <i className="fas fa-map-marker-alt text-blue-600"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">
                                                    Headquarters
                                                </h4>
                                                <p className="text-gray-600">
                                                    123 Pharma Avenue, Cebu
                                                    Business Park, Cebu City
                                                    6000, Philippines
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                <i className="fas fa-phone-alt text-blue-600"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">
                                                    Phone Numbers
                                                </h4>
                                                <p className="text-gray-600">
                                                    (032) 123 4567 (Cebu)
                                                </p>
                                                <p className="text-gray-600">
                                                    (082) 987 6543 (Davao)
                                                </p>
                                                <p className="text-gray-600">
                                                    (049) 555 1234 (Southern
                                                    Luzon)
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                <i className="fas fa-envelope text-blue-600"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">
                                                    Email
                                                </h4>
                                                <p className="text-gray-600">
                                                    info@primecarepharma.com
                                                </p>
                                                <p className="text-gray-600">
                                                    sales@primecarepharma.com
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                <i className="fas fa-clock text-blue-600"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">
                                                    Business Hours
                                                </h4>
                                                <p className="text-gray-600">
                                                    Monday to Friday: 8:00 AM -
                                                    5:00 PM
                                                </p>
                                                <p className="text-gray-600">
                                                    Saturday: 8:00 AM - 12:00 PM
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h4 className="font-medium text-gray-800 mb-4">
                                            Follow Us
                                        </h4>
                                        <div className="flex space-x-4">
                                            <a
                                                href="#"
                                                className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-full transition duration-300"
                                            >
                                                <i className="fab fa-facebook-f"></i>
                                            </a>
                                            <a
                                                href="#"
                                                className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-full transition duration-300"
                                            >
                                                <i className="fab fa-twitter"></i>
                                            </a>
                                            <a
                                                href="#"
                                                className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-full transition duration-300"
                                            >
                                                <i className="fab fa-linkedin-in"></i>
                                            </a>
                                            <a
                                                href="#"
                                                className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-full transition duration-300"
                                            >
                                                <i className="fab fa-instagram"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center mb-4">
                                    <i className="fas fa-pills text-blue-400 text-2xl mr-2"></i>
                                    <span className="text-xl font-bold">
                                        I.con Trade Pharmaceutical
                                    </span>
                                </div>
                                <p className="text-gray-400">
                                    Committed to providing quality and
                                    affordable healthcare products for
                                    Filipinos.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Quick Links
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#home"
                                            className="text-gray-400 hover:text-white transition duration-300"
                                        >
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#about"
                                            className="text-gray-400 hover:text-white transition duration-300"
                                        >
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#products"
                                            className="text-gray-400 hover:text-white transition duration-300"
                                        >
                                            Products
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#mission"
                                            className="text-gray-400 hover:text-white transition duration-300"
                                        >
                                            Mission & Vision
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#contact"
                                            className="text-gray-400 hover:text-white transition duration-300"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Products
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-white transition duration-300"
                                        >
                                            Cardiovascular
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-white transition duration-300"
                                        >
                                            Antibiotics
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-white transition duration-300"
                                        >
                                            Pain Relievers
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-white transition duration-300"
                                        >
                                            Vaccines
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-white transition duration-300"
                                        >
                                            Vitamins
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Newsletter
                                </h4>
                                <p className="text-gray-400 mb-4">
                                    Subscribe to our newsletter for the latest
                                    updates and health tips.
                                </p>
                                <form className="flex">
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="px-4 py-2 rounded-l-lg focus:outline-none text-gray-900 w-full"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition duration-300"
                                    >
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm mb-4 md:mb-0">
                                © 2023 I.con Trade Pharmaceutical. All rights
                                reserved.
                            </p>
                            <div className="flex space-x-6">
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition duration-300 text-sm"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition duration-300 text-sm"
                                >
                                    Terms of Service
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition duration-300 text-sm"
                                >
                                    Sitemap
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>

                <style>{`
        .hero-bg {
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
        }
        
        .mission-vision-card {
          transition: all 0.3s ease;
        }
        
        .mission-vision-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .product-card {
          transition: all 0.3s ease;
        }
        
        .product-card:hover {
          transform: scale(1.05);
        }
        
        .stats-item {
          transition: all 0.3s ease;
        }
        
        .stats-item:hover {
          transform: scale(1.1);
        }
      `}</style>
            </div>
        </>
    );
};

export default Welcome;
