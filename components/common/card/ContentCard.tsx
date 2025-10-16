import { Tag } from "antd";

export const ContentCard = ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div className="relative border rounded-md p-3 m-2 bg-card-color">
        <Tag className="absolute -top-2 left-3 " color="orange" > {title} </Tag>
        {children}
    </div>
)