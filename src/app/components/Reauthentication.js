import React from "react";

function ReauthenticationComponent({ errorMessages, reauthenticateHandler, password, passwordChangeHandler }) {
  return (
    <div className="fixed w-[40%] left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 p-[5%] bg-slate rounded-[20px] shadow-lg">
      <div className="flex justify-center items-center mb-[20px]">
        <h1 className="text-[40px] font-bold text-accent">Reauthenticate</h1>
      </div>
      {errorMessages.length > 0 && (
        <div className="flex flex-col w-full bg-muted p-3 border border-accent rounded-[10px] mb-[20px]">
          {errorMessages.map((error, index) => (
            <p key={index} className="text-accent font-bold text-[14px]">{error}</p>
          ))}
        </div>
      )}
      <form onSubmit={reauthenticateHandler} className="flex flex-col items-center">
        <input
          type="password"
          value={password}
          onChange={passwordChangeHandler}
          placeholder="Enter your password"
          className="w-[80%] p-[15px] border-[2px] border-solid  rounded-[50px] text-[18px] mb-[20px] focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
        <button
          type="submit"
          className="w-[80%] h-[50px] rounded-[50px] bg-accent text-foreground font-bold text-[18px] hover:bg-red-700 transition-all"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}

export default ReauthenticationComponent;
