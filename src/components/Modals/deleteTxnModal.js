import React, { useEffect } from 'react'
import { Modal,Form,Input,DatePicker,Select,Button } from 'antd';
import dayjs from "dayjs";



function DeleteTxnModal({showDeleteModal,setShowDeleteModal,txnData,deleteTransaction}) {
 
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
      title="Are you sure you want to delete this Transaction"
      open={showDeleteModal}
      onCancel={()=>{
        setShowDeleteModal(false);

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

        onFinish={()=>{
          deleteTransaction(txnData.id);
          setShowDeleteModal(false);

        }}
      >
        <Form.Item
          label="Name"
          name="Name"
        >
          
          <Input type='text' className='custom-input' readOnly />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          
        >
          <Input type='number' className='custom-input'  readOnly />

        </Form.Item>
        
        <Form.Item
          label="Date"
          name="date"
        >
          <DatePicker format="YYYY-MM-DD" className='custom-input' value={txnData.date} readOnly />
        </Form.Item>

        <Form.Item
          label="Tag"
          name="tag"
          
        >
          
          <Select className="select-input-2">
            <Select.Option value={txnData.tag}>{txnData.tag}</Select.Option>
          </Select>

        </Form.Item>
        
        <Form.Item>
          <Button
            className='btn btn-blue'
            type='primary'
            htmlType='submit'
            onClick={()=>setShowDeleteModal(false)}
            style={{background:'red',color:'white'}}
          >
            Delete TXN
          </Button>

        </Form.Item>

      </Form>


    </Modal> 
  )
}

export default DeleteTxnModal;