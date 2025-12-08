import React, { useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { Button, Select, Space } from 'antd';
import { IconZoomIn, IconZoomOut } from '@tabler/icons-react';

interface GanttChartProps {
    constructionId?: string | number;
}

export const GanttChart: React.FC<GanttChartProps> = ({ constructionId }) => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
    const [isChecked, setIsChecked] = useState(true);

    // Dummy Data
    const currentDate = new Date();
    const tasks: Task[] = [
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
            name: 'Base Stage',
            id: 'Task 0',
            type: 'task',
            progress: 100,
            isDisabled: true,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 16),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
            name: 'Frame Stage',
            id: 'Task 1',
            type: 'task',
            progress: 45,
            isDisabled: true,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
            dependencies: ['Task 0'],
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 26),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 30),
            name: 'Lockup Stage',
            id: 'Task 2',
            type: 'task',
            progress: 10,
            isDisabled: true,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
            dependencies: ['Task 1'],
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 10),
            name: 'Fixing Stage',
            id: 'Task 3',
            type: 'task',
            progress: 0,
            isDisabled: true,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
            dependencies: ['Task 2'],
        },
        {
            start: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 11),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 20),
            name: 'Completion Stage',
            id: 'Task 4',
            type: 'task',
            progress: 0,
            isDisabled: true,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
            dependencies: ['Task 3'],
        },
    ];

    const handleViewModeChange = (value: ViewMode) => {
        setViewMode(value);
    };

    const handleZoomIn = () => {
        if (viewMode === ViewMode.Month) setViewMode(ViewMode.Week);
        else if (viewMode === ViewMode.Week) setViewMode(ViewMode.Day);
        else if (viewMode === ViewMode.Day) setViewMode(ViewMode.Hour);
    };

    const handleZoomOut = () => {
        if (viewMode === ViewMode.Hour) setViewMode(ViewMode.Day);
        else if (viewMode === ViewMode.Day) setViewMode(ViewMode.Week);
        else if (viewMode === ViewMode.Week) setViewMode(ViewMode.Month);
    };

    const handleExpanderClick = (task: Task) => {
        // Implement logic if nested tasks are used
        console.log('Expander click', task);
    };


    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="font-semibold text-lg">Construction Schedule</div>
                <Space>
                    <Select
                        value={viewMode}
                        onChange={handleViewModeChange}
                        style={{ width: 120 }}
                        options={[
                            { value: ViewMode.Day, label: 'Day' },
                            { value: ViewMode.Week, label: 'Week' },
                            { value: ViewMode.Month, label: 'Month' },
                            { value: ViewMode.Year, label: 'Year' },
                        ]}
                    />
                    <Button icon={<IconZoomIn size={18} />} onClick={handleZoomIn}>Zoom In</Button>
                    <Button icon={<IconZoomOut size={18} />} onClick={handleZoomOut}>Zoom Out</Button>
                    <Button onClick={() => setViewMode(ViewMode.Month)}>Zoom to Fit</Button>
                </Space>
            </div>

            <div className="overflow-x-auto w-full max-w-full">
                <Gantt
                    tasks={tasks}
                    viewMode={viewMode}
                    onDateChange={(task: Task) => console.log('Date change', task)}
                    onDelete={(task: Task) => console.log('Delete', task)}
                    onProgressChange={(task: Task) => console.log('Progress', task)}
                    onDoubleClick={(task: Task) => console.log('Double click', task)}
                    onSelect={(task: Task, isSelected: boolean) =>
                        console.log('Select', task, isSelected)
                    }
                    onExpanderClick={handleExpanderClick}
                    listCellWidth={isChecked ? '155px' : ''}
                    columnWidth={viewMode === ViewMode.Year ? 350 : viewMode === ViewMode.Month ? 300 : viewMode === ViewMode.Week ? 250 : 65}
                    barFill={70}
                    ganttHeight={400}
                    headerHeight={50}
                    rowHeight={50}
                    fontSize="12px"
                />
            </div>
        </div>
    );
};