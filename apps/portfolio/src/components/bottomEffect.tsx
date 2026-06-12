import React from 'react';

const BottomEffect: React.FC = () => {
    return (
        <div className={"absolute bottom-0 left-0 w-full pointer-events-none -z-10"}>
            <div className={"flex justify-center w-full"}>
                <div
                    className={"w-[800px] md:w-[70%] h-40 rounded-full opacity-[0.04]"}
                    style={{
                        background: "radial-gradient(ellipse at center, #4ade80, transparent 70%)",
                    }}
                />
            </div>
        </div>
    );
};

export default BottomEffect;