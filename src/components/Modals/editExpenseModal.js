import React, { useEffect } from 'react'
import { Modal,Form,Input,DatePicker,Select,Button } from 'antd';
import dayjs from "dayjs";



function EditExpenseModal({showModal,setShowModal,txnData,updateTransaction}) {
 
  const [form]= Form.useForm();
  
  useEffect(() => {
      form.setFieldsValue({
        Name: txnData?.name,
        amount: txnData?.amount,
        tag: txnData?.tag, 
        date: txnData?.date ? dayjs(txnData.date) : null, // Convert string to Day.js object
      });
    }, [txnData, form]);
  
  
  return (
    txnData && <Modal
      title="Edit Expense Transaction"
      open={showModal}
      onCancel={()=>{
        setShowModal(false);

      }}
      footer={null}
    >
      
      <Form
        form={form}
        layout='vertical'
        initialValues={{ 
          Name: txnData?.name, 
          amount: txnData?.amount,
          date: txnData?.date ? dayjs(txnData.date) : null,
          tag: txnData?.tag, 
        }}  

        onFinish={(values)=>{
          
          //updateTxn()
          updateTransaction(txnData.id,values,"expenses");
          setShowModal(false);

        }}
      >
        <Form.Item
          label="new Name"
          name="Name"
         
          rules={[
            {
              required:true,
              message:"Please input the name of transaction ",
            },
          ]}
        >
          
          <Input type='text' className='custom-input' />
        </Form.Item>

        <Form.Item
          label="new Amount"
          name="amount"
          
          rules={[
            {
              required:true,
              message:"Please input the Expense amount ",
            },
          ]}
        >
          <Input type='number' className='custom-input' min={1}  />

        </Form.Item>
        
        <Form.Item
          label="new Date"
          name="date"
          rules={[
            {
              required:true,
              message:"Please input the Expense date ",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className='custom-input' value={txnData.date} />
        </Form.Item>

        <Form.Item
          label="new Tag"
          name="tag"
          
          rules={[
            {
              required:true,
              message:"Please select the tags ",
            },
          ]}
        >
          
          <Select className="select-input-2">
            <Select.Option value="food">Food & grocery</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="shopping">Shopping</Select.Option>
            <Select.Option value="entertainment">Entertainment</Select.Option>
            <Select.Option value="bills">Bills</Select.Option>
            <Select.Option value="otherExpenses">Other-expenses</Select.Option> 
          </Select>

        </Form.Item>
        
        <Form.Item>
          <Button
            className='btn btn-blue'
            type='primary'
            htmlType='submit'
            onClick={()=>setShowModal(false)}
          >
            Edit Expense
          </Button>

        </Form.Item>

      </Form>


    </Modal> 
  )
}

export default EditExpenseModal;