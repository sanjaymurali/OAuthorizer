(function () {
    angular
        .module("MainApp")
        .controller("adminController", adminController);

    function adminController($state, $stateParams,UserService, AdminService) {
        var vm = this;

        function init() {
            vm.userId = $stateParams['uid'];
            vm.currentUser = UserService.getUser();


            vm.editUser = editUser;
            vm.deleteUser = deleteUser;

            AdminService.findAllUsers().then(function(response){
                vm.allUsers = response.data.users;
            })


        }

        init();


        function editUser(userid) {

            $state.go('adminEditUser', {uid: userid});
        }

        function deleteUser(userid, index) {
            userid += "";

            AdminService.deleteUser(userid).then(function(res){
                if(res.statusText === "OK"){
                    alert("User Deleted!")
                    vm.allUsers.splice(index,1);
                }
            }, function(err){
                alert("Couldnt Delete the User!")
            })
        }



    }
})();