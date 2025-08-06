import { Head, Link, useForm } from "@inertiajs/react";
import { IoKeyOutline } from "react-icons/io5";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className="h-[100vh] flex flex-row">
                <div className="flex-1 bg-blue-900 text-center hidden md:flex">
                    <div
                        className=" m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
                        }}
                    ></div>
                </div>
                <div className="bg-white flex justify-center w-full lg:w-1/3 xl:w-4/12 p-6 lg:p-12">
                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <h1 className="text-2xl mt-20 xl:mt-32 xl:text-4xl font-extrabold text-blue-900">
                                Icon Trade Pharmaceutical
                            </h1>
                            <p className="text-[12px] text-gray-500">
                                Hey enter your details to create your account
                            </p>
                        </div>
                        <div className="w-full flex-1 mt-12 lg:mt-20">
                            <form method="post" onSubmit={submit}>
                                <div className="mx-auto max-w-xs flex flex-col gap-4">
                                    {(errors.email || errors.password) && (
                                        <span className="text-red-600 text-center w-full">
                                            Wrong email or password!
                                        </span>
                                    )}
                                    <input
                                        className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="text"
                                        value={data.email}
                                        placeholder="Email"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    <input
                                        className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="password"
                                        value={data.password}
                                        placeholder="Password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />

                                    <button
                                        className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <IoKeyOutline />
                                                <span className="ml-3">
                                                    Processing...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <IoKeyOutline />
                                                <span className="ml-3">
                                                    Login
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
