class UserDTO {
    constructor(user) {
        this.first_name = user._first_name;
        this.last_name = user._last_name;
        this.email = user.email;
        this.age = user._age;
        this.role = user._role;
    }
}

module.exports = UserDTO