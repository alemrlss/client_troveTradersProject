function SidebarProfile() {
  return (
    <div className="w-1/4 bg-black rounded-l-md flex flex-col">
      <img
        className="h-1/4 m-10 mr-20  ml-20 border-solid border-white border-4 rounded-full"
        src="https://placeimg.com/50/50/animals"
        alt=""
      />
      <hr />

      <div className="p-8">
        <h2 className="text-white p-1">Opcion #1</h2>
        <h2 className="text-white p-1">Opcion #2</h2>
        <h2 className="text-white p-1">Opcion #3</h2>
        <h2 className="text-white p-1">Opcion #4</h2>
        <h2 className="text-white p-1">Opcion #5</h2>
        <h2 className="text-white p-1">Opcion #6</h2>
      </div>
    </div>
  );
}

export default SidebarProfile;
