function TemplatePage(props) {

return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-24 pb-8">
      <div className="space-y-6 card w-85  h-auto md:w-100 md:h-auto bg-slate-800 border border-blue-500 shadow-sm p-8 rounded-md flex flex-col ">
        {props.children}
      </div>
      
    </div>
)   

}
export default TemplatePage;