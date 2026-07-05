import BudgetList from "@/components/BudgetList"
function page() {
  return (
    <div>
      <h1 className='font-bold p-10 text-3xl'>My Budgets</h1>
      <BudgetList />
    </div>
  )
}

export default page