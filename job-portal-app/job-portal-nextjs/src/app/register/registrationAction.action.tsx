"use server";

export const registrationAction = async (formData: FormData) => {
  console.log(Object.fromEntries(formData.entries()));

  const { name, userName, email, password, confirmPassword, role } =
    Object.fromEntries(formData.entries());
};
