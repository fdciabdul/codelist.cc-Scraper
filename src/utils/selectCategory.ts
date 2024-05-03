import inquirer from "inquirer";

export const selectCategory = async (categories: any[]) => {
    const choices = categories.map((cat: { name: any; id: any; }) => ({
        name: cat.name,
        value: cat.id,
    }));

    const { categoryId } = await inquirer.prompt([
        {
            type: "list",
            name: "categoryId",
            message: "Select a category:",
            choices: choices,
        },
    ]);

    return categoryId;
};
