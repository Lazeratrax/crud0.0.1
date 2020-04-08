const fs = require("fs");

let dataGeneral = fs.readFileSync("users.json", "utf8");
let users = JSON.parse(dataGeneral);

function random(users) {
   return Math.floor(users.reduce(function (ac, a) {
       return ac + +a.age
   }, 0)/users.length);
}

const add = async function (req) {
    if (req.name && req.age && req.gender) {
        const userName = req.name;
        const userAge = req.age;
        const userGender = req.gender;
        const user = {name: userName, age: userAge, gender: userGender};
        let id = 0;
        if (users.length) {
            // находим максимальный id
            id = Math.max(...users.map(o => o.id))
        }
        console.log(id);
        // увеличиваем его на единицу
        user.id = id + 1;
        // добавляем пользователя в массив
        users.push(user);

        let data = JSON.stringify(users);
        // перезаписываем файл с новыми данными
        fs.writeFileSync("users.json", data);
        return user;

    } else {
        throw new Error('неверные данные');
    }
}

const get = async function (req) {

    const id = req; // получаем id
    let user = null;
    // находим в массиве пользователя по id
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            user = users[i];
            break;
        }
    }
    // отправляем пользователя
    if (user) {
        return user;
    } else {
        throw new Error('пользователь не найден');
    }
}

const getAll = async function () {
    return users
}

const update = async function (req) {
    //console.log(req)
    if (req.name && req.age && req.gender) {

        const userId = req.id;
        const userName = req.name;
        const userAge = req.age;
        const userGender = req.gender;

        let user;
        for (let i = 0; i < users.length; i++) {
            if (users[i].id == userId) {
                user = users[i];
                break;
            }
        }
        // изменяем данные у пользователя
        if (user) {
            user.age = userAge;
            user.name = userName;
            user.gender = userGender;
            let data = JSON.stringify(users);
            fs.writeFileSync("users.json", data);
            return user;
        } else {
            throw new Error('user not found');
        }
    } else {
        throw new Error('incorrect data');
    }
}

const del = async function (req) {
    const id = req; // получаем id
    let index = -1;
    // находим индекс пользователя в массиве
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        // удаляем пользователя из массива по индексу
        const user = users.splice(index, 1)[0];
        let data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        // отправляем удаленного пользователя

        return user
    } else {
        throw new Error('пользователь не найден');
    }

}


module.exports = {
    add,
    get,
    update,
    del,
    getAll
}
