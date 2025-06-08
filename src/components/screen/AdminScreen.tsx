
export const AdminScreen = () => {
  return (
    <div className="w-full min-h-screen text-xl flex items-center justify-center gap-8 relative flex-col">
      <div 
    className="absolute inset-0 -z-20"
    style={{
      backgroundImage: 'url(/logoDesaturado.png)',
      backgroundSize: '385px auto',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}
  />
  <h1>Le damos la bienvenida a administración</h1>
</div>
  );
};