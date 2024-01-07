"use client";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import React, { type FormEvent, useState } from "react";
import { TRPCClientError } from "@trpc/client";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserSchema } from "~/schemas/User";

const CreateUser = () => {
  const {
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserSchema),
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const clearFields = () => {
    setName("");
    setPhone("");
    setEmail("");
  };

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      router.refresh();
      clearFields();
      toast.success("User created successfully!");
    },
    onError: ({ message }) => {
      toast.error("Something went wrong, try again!");
      throw new TRPCClientError(message);
    },
  });

  const onSubmit = () => {
    createUser.mutate({ name, phone, email });
  };

  const handleCancel = (e: FormEvent) => {
    e.preventDefault();
    clearErrors();
    clearFields();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="m-4 max-w-sm overflow-hidden rounded shadow-lg ">
        <div className="px-6 py-4">
          <input
            {...register("name")}
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Name"
            className={`focus:border-blue800  rounded border border-dashed  border-opacity-100 p-1 text-base text-gray-700 ${
              errors.name ? "mb-1 border-red-600" : "mb-2 border-gray-400"
            }`}
            type="text"
          />
          {errors.name && (
            <span className="mb-1 mt-1 block text-red-500">
              {errors.name?.message?.toString()}
            </span>
          )}

          <input
            {...register("email")}
            value={email}
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            className={`focus:border-blue800  rounded border border-dashed  border-opacity-100 p-1 text-base text-gray-700 ${
              errors.email ? "mb-1 border-red-600" : "mb-2 border-gray-400"
            }`}
          />
          {errors.email && (
            <span className="mb-1 mt-1 block text-red-500">
              {errors.email?.message?.toString()}
            </span>
          )}
          <input
            {...register("phone")}
            value={phone}
            placeholder="Phone"
            onChange={(e) => setPhone(e.target.value)}
            className={`focus:border-blue800  rounded border border-dashed  border-opacity-100 p-1 text-base text-gray-700 ${
              errors.phone ? "mb-1 border-red-600" : "mb-2 border-gray-400"
            }`}
            type="text"
          />
          {errors.phone && (
            <span className="mb-1 mt-1 block text-red-500">
              {errors.phone?.message?.toString()}
            </span>
          )}
        </div>
        <div className="px-6 pb-2 pt-4">
          <button
            disabled={createUser.isLoading}
            type="submit"
            className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
          >
            {createUser.isLoading ? "Creating..." : "Create"}
          </button>
          <button
            onClick={(e) => handleCancel(e)}
            className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateUser;
