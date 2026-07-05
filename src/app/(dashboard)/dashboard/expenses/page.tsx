import LatestExpenseTable from '@/components/LatestExpenseTable'
import React from 'react'

function page() {
  return (
    <div className='p-4'>
        <h1 className='font-bold mb-4 text-3xl'>Latest Expenses</h1>
        <LatestExpenseTable />
    </div>
  )
}

export default page