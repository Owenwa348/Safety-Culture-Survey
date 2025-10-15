// controllers/Questions/questionController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ดึงคำถามทั้งหมด (พร้อม options)
const getQuestions = async (req, res) => {
  try {
    // Get all questions ordered by order field
    let questions;
    try {
      questions = await prisma.question.findMany({
        include: { options: true },
        orderBy: { order: 'asc' }
      });
    } catch (orderError) {
      // If order field doesn't exist, fall back to ordering by id
      console.log('Order field not found, falling back to ID ordering');
      const questionsById = await prisma.question.findMany({
        include: { options: true },
        orderBy: { id: 'asc' }
      });
      // Add a default order value for frontend compatibility
      questions = questionsById.map((q, index) => ({
        ...q,
        order: q.order !== undefined ? q.order : index
      }));
    }
    
    res.status(200).json(questions);
  } catch (error) {
    console.error('getQuestions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// เพิ่มคำถามใหม่
const addQuestion = async (req, res) => {
  try {
    const { categoryId, text, options } = req.body
    if (!categoryId || !text || !text.trim())
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' })

    // For new questions, get the next available order number globally
    // This ensures questions are numbered sequentially across all categories
    let nextOrder = 0
    try {
      const maxOrder = await prisma.question.aggregate({
        _max: { order: true }
      })
      nextOrder = (maxOrder._max.order !== null ? maxOrder._max.order : -1) + 1
    } catch (orderError) {
      // If order field doesn't exist, count all existing questions
      const questionCount = await prisma.question.count()
      nextOrder = questionCount
    }

    // Try to create question with order field
    try {
      const created = await prisma.question.create({
        data: {
          text: text.trim(),
          categoryId: parseInt(categoryId),
          order: nextOrder,  // Set the global order
          options: {
            create: (options || []).map(o => ({ text: o.text }))
          }
        },
        include: { options: true }
      })
      res.status(201).json(created)
    } catch (createError) {
      // If order field doesn't exist, create without it
      const created = await prisma.question.create({
        data: {
          text: text.trim(),
          categoryId: parseInt(categoryId),
          options: {
            create: (options || []).map(o => ({ text: o.text }))
          }
        },
        include: { options: true }
      })
      // Add order field to response for frontend compatibility
      res.status(201).json({
        ...created,
        order: nextOrder
      })
    }
  } catch (error) {
    console.error('addQuestion error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// อัปเดตคำถาม
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const { text, categoryId, options, order } = req.body  // Added order parameter
    if (!text || !text.trim())
      return res.status(400).json({ message: 'คำถามเป็นข้อมูลบังคับ' })

    // If order is provided, we need to handle reordering
    if (order !== undefined) {
      try {
        await handleQuestionReordering(parseInt(id), parseInt(order), parseInt(categoryId))
      } catch (reorderError) {
        // If reordering fails due to missing order field, continue without reordering
        console.log('Reordering failed, continuing without reordering')
      }
    }

    // ลบ options เดิมก่อน
    await prisma.option.deleteMany({ where: { questionId: parseInt(id) } })

    // Try to update with order field
    try {
      const updated = await prisma.question.update({
        where: { id: parseInt(id) },
        data: {
          text: text.trim(),
          categoryId: parseInt(categoryId),
          ...(order !== undefined && { order: parseInt(order) }),  // Update order if provided
          options: {
            create: (options || []).map(o => ({ text: o.text }))
          }
        },
        include: { options: true }
      })
      res.status(200).json(updated)
    } catch (updateError) {
      // If order field doesn't exist, update without it
      const updated = await prisma.question.update({
        where: { id: parseInt(id) },
        data: {
          text: text.trim(),
          categoryId: parseInt(categoryId),
          options: {
            create: (options || []).map(o => ({ text: o.text }))
          }
        },
        include: { options: true }
      })
      // Add order field to response for frontend compatibility
      res.status(200).json({
        ...updated,
        order: updated.order !== undefined ? updated.order : 0
      })
    }
  } catch (error) {
    console.error('updateQuestion error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// ย้ายคำถามไปหมวดหมู่อื่น
const moveQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const { newCategoryId } = req.body
    if (!newCategoryId)
      return res.status(400).json({ message: 'กรุณาระบุหมวดหมู่ใหม่' })

    // Simply move the question to the new category while preserving its order
    // This ensures the question keeps its original number
    try {
      const updated = await prisma.question.update({
        where: { id: parseInt(id) },
        data: { 
          categoryId: parseInt(newCategoryId)
          // Keep the existing order field value
        }
      })
      res.status(200).json(updated)
    } catch (updateError) {
      // If order field doesn't exist, update without it
      const updated = await prisma.question.update({
        where: { id: parseInt(id) },
        data: { 
          categoryId: parseInt(newCategoryId)
        }
      })
      res.status(200).json(updated)
    }
  } catch (error) {
    console.error('moveQuestion error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// ลบคำถาม
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const question = await prisma.question.findUnique({
      where: { id: parseInt(id) }
    })

    if (!question) {
      return res.status(404).json({ message: 'ไม่พบคำถาม' })
    }

    // Delete options first
    await prisma.option.deleteMany({ where: { questionId: parseInt(id) } })
    
    // Delete the question
    await prisma.question.delete({ where: { id: parseInt(id) } })
    
    // Don't reorder questions when deleting - preserve the numbering scheme
    // The frontend will handle displaying sequential numbers based on order field
    
    res.status(200).json({ message: 'ลบคำถามสำเร็จ' })
  } catch (error) {
    console.error('deleteQuestion error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Function to handle question reordering
const handleQuestionReordering = async (questionId, newOrder, categoryId) => {
  try {
    // Get the current question
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    })

    if (!question) return

    const oldOrder = question.order !== undefined ? question.order : 0
    const categoryIdInt = parseInt(categoryId)
    const oldCategoryId = question.categoryId

    // If neither the category nor order is changing, no need to do anything
    if (oldOrder === newOrder && oldCategoryId === categoryIdInt) {
      return
    }

    if (oldCategoryId !== categoryIdInt) {
      // Moving to a different category
      // Update the question's category but preserve its order for display purposes
      await prisma.question.update({
        where: { id: questionId },
        data: {
          categoryId: categoryIdInt
          // Keep the existing order value
        }
      })
    } else {
      // Same category reordering - update the order field
      await prisma.question.update({
        where: { id: questionId },
        data: { order: newOrder }
      })
    }
  } catch (error) {
    console.error('handleQuestionReordering error:', error)
    // If the error is due to missing order column, rethrow it so the calling function can handle it
    if (error.message && error.message.includes('Unknown column')) {
      throw error
    }
    // Otherwise, log and continue
    console.log('Reordering failed, continuing without reordering')
  }
}

// Function to handle reordering after deletion
const handleQuestionReorderingAfterDeletion = async (categoryId, deletedOrder) => {
  try {
    // Decrement the order of all questions that come after the deleted one
    await prisma.question.updateMany({
      where: {
        categoryId: parseInt(categoryId),
        order: { gt: deletedOrder }
      },
      data: {
        order: { decrement: 1 }
      }
    })
  } catch (error) {
    console.error('handleQuestionReorderingAfterDeletion error:', error)
    // If the error is due to missing order column, rethrow it so the calling function can handle it
    if (error.message && error.message.includes('Unknown column')) {
      throw error
    }
    // Otherwise, log and continue
    console.log('Reordering after deletion failed, continuing without reordering')
  }
}

module.exports = {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  moveQuestion
}