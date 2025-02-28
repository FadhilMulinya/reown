// SPDX-License-Identifier:MIT
pragma solidity 0.8.28;

contract Todo {
    struct Task {
        uint256 id;
        string title;
        string content;
        bool done;
    }

    mapping(uint256 => Task) internal tasks;
    uint256 internal taskCount = 1; // Start task IDs at 1

    function createTask(string memory _title, string memory _content) external {
        tasks[taskCount] = Task(taskCount, _title, _content, false);
        taskCount++;
    }

    function updateTask(uint256 _id, string memory _content) external {
        require(_id < taskCount && _id > 0, "Task does not exist");
        require(!tasks[_id].done, "Task is already done");

        tasks[_id].content = _content;
    }

    function markTaskDone(uint256 _id) external {
        require(_id < taskCount && _id > 0, "Task does not exist");
        require(!tasks[_id].done, "Task is already done");
        
        tasks[_id].done = true;
    }

    function readTask(uint256 _id) external view returns (string memory, string memory, bool) {
        require(_id < taskCount && _id > 0, "Task does not exist");
        return (tasks[_id].title, tasks[_id].content, tasks[_id].done);
    }

    function deleteTask(uint256 _id) external {
        require(_id < taskCount && _id > 0, "Task does not exist");
        
        delete tasks[_id];  
    }
}