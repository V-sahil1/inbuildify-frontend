import Link from "next/link";

interface NoDataMessageProps {
  label: string;
  link: string;
}

const NoDataMessage = ({ label, link }: NoDataMessageProps) => {
  return (
    <div className="px-2 py-1 text-gray-400 text-center break-words">
      <p className="whitespace-normal">No {label} found.</p>
      <p className="whitespace-normal">
        <Link href={link} className="text-primary hover:underline">
          Click here
        </Link>{" "}
        to create {label}
      </p>
    </div>
  );
};

export default NoDataMessage;
