"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { UserSchema } from "~/schemas/User";
import { type UserCardProps } from "./@types";

const UserCard = ({ user }: UserCardProps) => {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(UserSchema),
  });
  const router = useRouter();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const resetFields = () => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
  };

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("User deleted successfully!");
    },
    onError: ({ message }) => {
      toast.error("Something went wrong, try again!");
      throw new TRPCClientError(message);
    },
  });

  const updateUser = api.user.updateUser.useMutation({
    onSuccess: () => {
      setIsEdit(!isEdit);
      router.refresh();
      toast.success("User updated successfully!");
    },
    onError: ({ message }) => {
      toast.error("Something went wrong, try again!");
      throw new TRPCClientError(message);
    },
  });
  const handleDelete = () => {
    deleteUser.mutate({ id: user.id });
  };

  const handleCancel = () => {
    resetFields();
    setIsEdit(!isEdit);
  };

  const onSubmit = () => {
    updateUser.mutate({ name, email, phone, id: user.id });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="m-4 max-w-sm overflow-hidden rounded shadow-lg ">
        <div className="px-6 py-4">
          <input
            {...register("name")}
            onChange={(e) => setName(e.target.value)}
            className="mb-2 rounded border border-dashed border-gray-400 border-opacity-100 p-1 text-base text-gray-700 focus:border-blue-800  disabled:border-solid"
            type="text"
            value={name}
            disabled={!isEdit}
          />
          {formState.errors.name && (
            <span className="mb-1 mt-1 block text-red-500">
              {formState.errors.name?.message?.toString()}
            </span>
          )}
          <input
            {...register("email")}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 rounded border border-dashed border-gray-400 border-opacity-100 p-1 text-base text-gray-700 focus:border-blue-800  disabled:border-solid"
            type="text"
            value={email}
            disabled={!isEdit}
          />
          {formState.errors.email && (
            <span className="mb-1 mt-1 block text-red-500">
              {formState.errors.email?.message?.toString()}
            </span>
          )}
          <input
            {...register("phone")}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-2 rounded border border-dashed border-gray-400 border-opacity-100 p-1 text-base text-gray-700 focus:border-blue-800  disabled:border-solid"
            type="text"
            value={phone}
            disabled={!isEdit}
          />
          {formState.errors.phone && (
            <span className="mb-1 mt-1 block text-red-500">
              {formState.errors.phone?.message?.toString()}
            </span>
          )}
        </div>
        <div className="px-6 pb-2 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={updateUser.isLoading}
            className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
          >
            {isEdit ? "Cancel" : "Edit"}
          </button>
          {isEdit && (
            <button
              type="submit"
              disabled={updateUser.isLoading}
              className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
            >
              Save
            </button>
          )}

          <button
            type="button"
            disabled={deleteUser.isLoading}
            onClick={() => handleDelete()}
            className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
          >
            {deleteUser.isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserCard;
