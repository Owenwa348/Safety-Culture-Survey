const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all users for UserList.vue
const getAllUsers = async (req, res) => {
  try {
    // Get users from user_excel table (unregistered users) - ordered by ID to maintain original sequence
    const excelUsers = await prisma.user_excel.findMany({
      select: {
        id: true,
        email_user: true,
        company_user: true,
        division_user: true,
        createdAt: true
      },
      orderBy: {
        id: 'asc' // Maintain original order from Excel import
      }
    });

    // Get registered users from User table
    const registeredUsers = await prisma.user.findMany({
      select: {
        id: true,
        title_user: true,
        name_user: true,
        email_user: true,
        company_user: true,
        phone_user: true,
        position_user: true,
        job_field_user: true,
        work_group_user: true,
        years_of_service: true,
        section_user: true,
        status: true,
        surveyStatus: true, // Include survey status
        createdAt: true
      }
    });

    // Create a map of registered users by email for quick lookup
    const registeredUserMap = new Map(registeredUsers.map(user => [user.email_user, user]));

    // Create a combined list maintaining the original Excel order
    const allUsers = excelUsers.map(excelUser => {
      // Check if this user has registered
      const registeredUser = registeredUserMap.get(excelUser.email_user);
      
      if (registeredUser) {
        // Return the registered user data
        return {
          id: registeredUser.id,
          title_user: registeredUser.title_user || "-",
          name_user: registeredUser.name_user || "-",
          email_user: registeredUser.email_user,
          company_user: registeredUser.company_user,
          phone_user: registeredUser.phone_user || "-",
          position_user: registeredUser.position_user || "-",
          job_field_user: registeredUser.job_field_user || "-",
          work_group_user: registeredUser.work_group_user || "-",
          years_of_service: registeredUser.years_of_service || "-",
          section_user: registeredUser.section_user || "-",
          status: registeredUser.surveyStatus === 'done' ? 'done' : 
                  registeredUser.surveyStatus === 'in_progress' ? 'in_progress' : 
                  registeredUser.status === "active" ? "registered" : registeredUser.status,
          createdAt: registeredUser.createdAt,
          sortOrder: excelUser.id // Use Excel record ID for sorting to maintain original position
        };
      } else {
        // Return the Excel user data (not registered yet)
        return {
          id: null,
          title_user: "-",
          name_user: "-",
          email_user: excelUser.email_user,
          company_user: excelUser.company_user,
          phone_user: "-",
          position_user: "-",
          job_field_user: "-", 
          work_group_user: "-",
          years_of_service: "-",
          section_user: excelUser.division_user || "-",
          status: "not_registered",
          createdAt: excelUser.createdAt,
          sortOrder: excelUser.id // Use Excel record ID for sorting
        };
      }
    });
    
    res.status(200).json(allUsers);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check if email exists in user_excel table (for LoginEvaluator.vue)
const checkUserEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Check if email exists in user_excel
    const excelUser = await prisma.user_excel.findUnique({
      where: { email_user: email },
    });

    if (!excelUser) {
      return res.status(404).json({ message: 'Email not found in system.' });
    }

    // Check if user is already registered
    const registeredUser = await prisma.user.findUnique({
      where: { email_user: email },
    });

    if (registeredUser) {
      return res.status(200).json({ 
        message: 'User already registered.', 
        email: email,
        isRegistered: true,
        company: excelUser.company_user,
        division: excelUser.division_user || "-",
        surveyStatus: registeredUser.surveyStatus, // Include survey status
        userId: registeredUser.id // Include user ID
      });
    }

    // User exists in excel but not registered
    res.status(200).json({ 
      message: 'Email found. Ready for registration.', 
      email: email,
      isRegistered: false,
      company: excelUser.company_user,
      division: excelUser.division_user || "-"
    });
  } catch (error) {
    console.error('Check user email error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Register a new user (for EvaluatorRegistration.vue)
const registerUser = async (req, res) => {
  const { 
    title,
    fullName, 
    email, 
    phone, 
    company, 
    position, 
    department, 
    workGroup, 
    workExperience,
    password 
  } = req.body;

  // Validate required fields
  if (!title || !fullName || !email || !phone || !company || !position || !department || !workGroup || !workExperience) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email_user: email },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Check if email exists in user_excel
    const excelUser = await prisma.user_excel.findUnique({
      where: { email_user: email },
    });

    if (!excelUser) {
      return res.status(404).json({ message: 'Email not found in system. Please contact administrator.' });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        title_user: title,
        name_user: fullName,
        email_user: email,
        company_user: company,
        phone_user: phone,
        position_user: position,
        job_field_user: department,
        work_group_user: workGroup,
        years_of_service: workExperience,
        section_user: excelUser.division_user || "-", // Use division from excel as section
        password_user: password || null, // In a real app, this should be hashed
        status: "active",
        surveyStatus: "not_started" // Initialize survey status
      },
    });

    res.status(201).json({ 
      message: 'User registered successfully.', 
      user: {
        id: newUser.id,
        title_user: newUser.title_user,
        name_user: newUser.name_user,
        email_user: newUser.email_user,
        company_user: newUser.company_user,
        phone_user: newUser.phone_user,
        position_user: newUser.position_user,
        job_field_user: newUser.job_field_user,
        work_group_user: newUser.work_group_user,
        years_of_service: newUser.years_of_service,
        section_user: newUser.section_user,
        status: newUser.surveyStatus === 'done' ? 'done' : 
                newUser.surveyStatus === 'in_progress' ? 'in_progress' : 
                newUser.status,
        surveyStatus: newUser.surveyStatus
      }
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login user (for LoginEvaluator.vue)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email_user: email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    // In a real application, you would validate the password here
    // For now, we'll just check if the user exists
    
    // Return user data without sensitive information
    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        title_user: user.title_user,
        name_user: user.name_user,
        email_user: user.email_user,
        company_user: user.company_user,
        phone_user: user.phone_user,
        position_user: user.position_user,
        job_field_user: user.job_field_user,
        work_group_user: user.work_group_user,
        years_of_service: user.years_of_service,
        section_user: user.section_user,
        status: user.surveyStatus === 'done' ? 'done' : 
                user.surveyStatus === 'in_progress' ? 'in_progress' : 
                user.status,
        surveyStatus: user.surveyStatus
      }
    });
  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user by email
const deleteUser = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // First, try to delete the user from the main User table.
    // This might fail if there are foreign key constraints (e.g., survey answers),
    // so we wrap it in a try-catch to prevent it from stopping the process.
    try {
      await prisma.user.deleteMany({
        where: { email_user: email },
      });
    } catch (e) {
      console.error(`Could not delete user '${email}' from User table, probably due to existing relations. Error: ${e.message}`);
    }

    // Always attempt to delete from the user_excel table.
    // This is the source for the user list, so this ensures the user is removed from the UI.
    const deleteResult = await prisma.user_excel.deleteMany({
      where: { email_user: email },
    });

    if (deleteResult.count === 0) {
      // This can happen if the email doesn't exist in user_excel.
      return res.status(404).json({ message: 'User not found in the list.' });
    }

    res.status(200).json({ message: 'User removed from the list successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  checkUserEmail,
  registerUser,
  loginUser, // Export the new login function
  deleteUser,
};